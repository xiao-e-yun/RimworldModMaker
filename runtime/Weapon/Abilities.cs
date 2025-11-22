using System.Collections.Generic;
using RimWorld;
using Verse;

namespace RimWorldModMakerRuntime {
  public class CompWeaponAbilities : CompEquippable
  {
      public CompProperties_WeaponAbilities Props => this.props as CompProperties_WeaponAbilities;

      public override void Initialize(CompProperties props)
      {
          base.Initialize(props);
          if (this.Holder == null) return;
          foreach (Ability ability in this.AbilitysForReading)
          {
              ability.pawn = this.Holder;
              ability.verb.caster = (Thing)this.Holder;
          }
      }

      public override void Notify_Equipped(Pawn pawn)
      {
          base.Notify_Equipped(pawn);
          foreach (Ability ability in this.AbilitysForReading)
          {
              ability.pawn = pawn;
              ability.verb.caster = (Thing)pawn;
              pawn.abilities.GainAbility(ability.def);
          }
      }

      public override void Notify_Unequipped(Pawn pawn)
      {
          base.Notify_Unequipped(pawn);
          foreach (Ability ability in this.AbilitysForReading)
              pawn.abilities.RemoveAbility(ability.def);
      }

      public List<Ability> AbilitysForReading
      {
          get
          {
              List<Ability> abilitysForReading = new List<Ability>();
              foreach (AbilityDef abilitieDef in this.Props.AbilitieDefs)
                  abilitysForReading.Add(AbilityUtility.MakeAbility(abilitieDef, this.Holder));
              return abilitysForReading;
          }
      }
  }

  public class CompProperties_WeaponAbilities : CompProperties
  {
      public List<AbilityDef> AbilitieDefs;
      public CompProperties_WeaponAbilities() => this.compClass = typeof(CompWeaponAbilities);
  }
}
