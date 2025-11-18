# RimWorld Mod Maker

A **TypeScript framework** for programmatically creating RimWorld mods.


## ✨ Features

- Write mods easily with **TypeScript / JavaScript**  
- **Compile-time type checking** saves development time  
- **Component-based design** improves readability  

## 🔮 Future Features

1. 📚 Expanded support for more **Defs**  
2. ⚡ Dynamic libraries based on **JavaScript**  
3. 🩹 Built-in **patch support**  

## 📖 Example

Here’s a minimal working example of defining a custom weapon mod:

To get started, first install the [`rimworld-mod-maker`](https://www.npmjs.com/package/rimworld-mod-maker) package:
```bash
bun add rimworld-mod-maker
```

Then, create an `index.ts` file with the following content:
```ts
import {
    // This is entry point of the library
    defineMod,
    // Components
    GraphicComponent, ItemComponent, MeleeWeaponComponent, RangedWeaponComponent, MeleeAttackComponent, RangedAttackComponent, GenericWeaponComponent,
    // Some fixed types
    GraphicType, VerbClass,
    // Vanilla defs for reference
    VanillaDamageDef, VanillaThingDef, VanillaToolCapacityDef
} from "rimworld-mod-maker";

// Define your mod
defineMod({
    id: "demo-mod",
    name: "Demo Mod",
    author: "Xiaoeyun",
    description: "A demo mod created using rimworld-mod-maker.",
    version: "1.0.0",
    supportedVersions: ["1.6"],

    iconPath: "./assets/icon.png",
    previewPath: "./assets/preview.png",

    pretty: true,
    clean: true,
    output: "../../DemoMod",
}, ctx => {
    // You can define contents here

    ctx.defineWeapon({
        name: "MyFourthWeapon",
        label: "Blue Archiver Role",
        description: "A simple ranged weapon created for demonstration purposes.",
    }, [
        ItemComponent({ mass: 3.0 }),
        GraphicComponent(ctx.bundleTextures("./assets/ranagedWeapon.png"), GraphicType.Single),
        GenericWeaponComponent(),
        RangedWeaponComponent(),
        RangedAttackComponent({
            verbClass: VerbClass.Verb_Shoot,
            defaultProjectile: VanillaThingDef.Bullet_AutocannonTurret,
            hasStandardCommand: true,
            warmupTime: 10,
            range: 50,
            burstShotCount: 150,
            rpm: 1800,
            muzzleFlashScale: 25,
        }),
        MeleeAttackComponent([
            {
                label: "Stab",
                capacities: [VanillaToolCapacityDef.Stab],
                power: 3,
                cooldown: 2.5,
            }
        ])
    ])
});
```

---

# Contribute to the project

1. requirements:
    - [Bun](https://bun.sh) v1.1.30 or higher  
    - [Python](https://www.python.org) 3.8 or higher (for tools)

2. To install dependencies:

```bash
bun install
```

3. To build the project:

```bash
bun run build
```

## 🛠 Toolset

Our toolset is designed to save you time and reduce repetitive work:

- **`dumper.py`**  
    Extracts XML definitions directly from the RimWorld game data directory and generates TypeScript type files (`src/defs/vanilla.ts`).  
    ```bash
    python tools/dumper.py
    ```

## 📂 Project Structure

- **defs/** – various RimWorld definition types  
- **components/** – modular definition components
- **utils.ts** – Utility functions and type definitions
- **xml.ts** – Utilities for XML generation and manipulation  
- **io.ts** – File operation helpers  