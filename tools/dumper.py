#!/usr/bin/env python3
"""
RimWorld XML Def Dumper
Extract definitions from RimWorld XML Def files and generate TypeScript enum files
"""

import os
import xml.etree.ElementTree as ET
from typing import Dict, List, Optional
from dataclasses import dataclass
from pathlib import Path

# Configuration Constants
# Path to XML Def directory to scan (relative to dumper.py)
DATA_DIR = "YOUR_RIMWORLD_DATA_DIR_HERE"
# TypeScript file output path
OUTPUT_PATH = "../src/defs/vanilla.ts"
# Prefix for generated enums, e.g. VanillaAbilityGroupDef
PREFIX = "Vanilla"
# DefId import path
IMPORT_PATH = "."


@dataclass
class DefInfo:
    """Def definition information"""
    defName: Optional[str] = None
    name: Optional[str] = None  # Name attribute (for Abstract defs)
    label: Optional[str] = None  # description preferred, otherwise label
    parent: Optional[str] = None  # ParentName attribute
    abstract: bool = False


class RimWorldDefDumper:
    """RimWorld Def Extractor"""
    
    def __init__(self, data_dir: str, output_path: str, prefix: str = "Vanilla", import_path: str = "../TEMP"):
        self.data_dir = Path(data_dir)
        self.output_path = Path(output_path)
        self.prefix = prefix
        self.import_path = import_path
        self.results: Dict[str, List[DefInfo]] = {}
    
    def scan_xml_files(self):
        """Scan all XML files in directory"""
        xml_files = []
        for root, dirs, files in os.walk(self.data_dir):
            for file in files:
                if file.endswith('.xml'):
                    xml_files.append(Path(root) / file)
        return xml_files
    
    def parse_xml_file(self, xml_file: Path):
        """Parse a single XML file"""
        try:
            tree = ET.parse(xml_file)
            root = tree.getroot()
            
            # Ensure root element is <Defs>
            if root.tag != 'Defs':
                return
            
            # Iterate through all child elements (each is a Def)
            for def_element in root:
                def_type = def_element.tag
                def_info = self.parse_def_element(def_element)
                
                if def_type not in self.results:
                    self.results[def_type] = []
                
                self.results[def_type].append(def_info)
                
        except ET.ParseError as e:
            print(f"Failed to parse XML file: {xml_file}, Error: {e}")
        except Exception as e:
            print(f"Error processing file: {xml_file}, Error: {e}")
    
    def parse_def_element(self, element: ET.Element) -> DefInfo:
        """Parse a single Def element"""
        def_info = DefInfo()
        
        # Get attributes
        def_info.name = element.get('Name')
        def_info.parent = element.get('ParentName')
        abstract_attr = element.get('Abstract')
        def_info.abstract = abstract_attr == 'True' if abstract_attr else False

        # Get child elements
        defname_elem = element.find('defName')
        if defname_elem is not None and defname_elem.text:
            def_info.defName = defname_elem.text.strip()
        
        label_elem = element.find('label')
        description_elem = element.find('description')
        
        # description preferred, otherwise use label
        if description_elem is not None and description_elem.text:
            # Convert \n to actual newlines
            def_info.label = description_elem.text.strip().replace('\\n', '\n')
        elif label_elem is not None and label_elem.text:
            # Convert \n to actual newlines
            def_info.label = label_elem.text.strip().replace('\\n', '\n')

        # No defName means it must be Abstract
        if not def_info.defName:
            def_info.abstract = True
        
        return def_info
    
    def sort_defs(self):
        """Sort Defs: abstract true first, then by defName/name"""
        for def_type in self.results:
            self.results[def_type].sort(
                key=lambda x: (
                    not x.abstract,  # abstract True comes first
                    x.defName or x.name or ''  # Sort by name
                )
            )
    
    def generate_typescript(self):
        """Generate TypeScript file"""
        # Ensure output directory exists
        self.output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(self.output_path, 'w', encoding='utf-8') as f:
            f.write('// ==========================\n')
            f.write('// THIS FILE IS AUTO-GENERATED\n')
            f.write('// DO NOT EDIT MANUALLY\n')
            f.write('// ==========================\n')
            f.write(f'import {{ DefId, createDefId }} from "{self.import_path}"\n\n')
            
            # Generate DefType enum
            f.write('export enum DefType {\n')
            for def_type in sorted(self.results.keys()):
                f.write(f'  {def_type} = "{def_type}",\n')
            f.write('}\n\n')
            
            # Generate enum for each DefType
            for def_type in sorted(self.results.keys()):
                defs = self.results[def_type]
                
                # Generate type alias - using string literal generic
                f.write(f'/** @reference {self.prefix}{def_type} */\n')
                f.write(f'export type {def_type}Id = DefId<"{def_type}">\n')
                
                # Generate enum
                f.write(f'export const {self.prefix}{def_type} = {{\n')
                
                # Non-abstract defs
                non_abstract_defs = [d for d in defs if not d.abstract and d.defName]
                
                # filter same defName duplicates
                seen_defnames = set()
                non_abstract_defs = [d for d in non_abstract_defs if not (d.defName in seen_defnames or seen_defnames.add(d.defName))]

                for def_info in non_abstract_defs:
                    # Generate JSDoc
                    if def_info.label or def_info.parent:
                        f.write('  /**\n')
                        if def_info.label:
                            # Handle multi-line label
                            label_lines = def_info.label.split('\n')
                            for line in label_lines:
                                if line.strip():
                                    f.write(f'   * {line.strip()}\n')
                        if def_info.parent:
                            f.write(f'   * @parent {def_info.parent}\n')
                        f.write('   */\n')
                    
                    f.write(f'  "{def_info.defName}": createDefId("{def_type}", "{def_info.defName}"),\n')
                
                # Abstract defs as comments
                abstract_defs = [d for d in defs if d.abstract and (d.name or d.defName)]
                if abstract_defs:
                    f.write('\n  // # Abstract Def\n')
                    for i, def_info in enumerate(abstract_defs):
                        f.write('  //==========================\n')
                        name = def_info.name or def_info.defName
                        f.write(f'  // @name {name}\n')
                        if def_info.parent:
                            f.write(f'  // @parent {def_info.parent}\n')
                        if def_info.label:
                            label_lines = def_info.label.split('\n')
                            for line in label_lines:
                                if line.strip():
                                    f.write(f'  // {line.strip()}\n')
                        # Only add separator if not the last def
                        if i < len(abstract_defs) - 1:
                            f.write('  //==========================\n')
                
                f.write('} as const\n\n')
        
        print(f'Generated TypeScript file: {self.output_path}')
    
    def save_json_results(self):
        """Save JSON results for debugging (disabled)"""
        # No longer generating JSON files
        pass
    
    def run(self):
        """Execute complete workflow"""
        print(f'Starting directory scan: {self.data_dir}')
        xml_files = self.scan_xml_files()
        print(f'Found {len(xml_files)} XML files')
        
        print('Parsing XML files...')
        for i, xml_file in enumerate(xml_files, 1):
            if i % 100 == 0:
                print(f'Processed {i}/{len(xml_files)} files...')
            self.parse_xml_file(xml_file)
        
        print(f'Parsing complete, found {len(self.results)} DefTypes')
        
        print('Sorting...')
        self.sort_defs()
        
        print('Generating TypeScript file...')
        self.generate_typescript()
        
        print('Done!')


def main():
    """Main function"""
    # Use constant configuration
    script_dir = Path(__file__).parent
    data_dir = (script_dir / DATA_DIR).resolve()
    output_path = (script_dir / OUTPUT_PATH).resolve()
    
    dumper = RimWorldDefDumper(
        data_dir=str(data_dir),
        output_path=str(output_path),
        prefix=PREFIX,
        import_path=IMPORT_PATH
    )
    
    dumper.run()


if __name__ == '__main__':
    main()
