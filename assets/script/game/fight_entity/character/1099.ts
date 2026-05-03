import { math } from "cc";
import { GetCharacterCoordinatePosition } from "../../../prefab/HolCharacter";
import { FightMap } from "../../../scenes/Fight/Canvas/FightMap";
import { util } from "../../../util/util";
import { ActionState } from "../../fight/ActionState";
import { BasicState } from "../../fight/BasicState";
import { RegisterCharacter } from "../../fight/character/CharacterEnum";
import { CharacterMetaState } from "../../fight/character/CharacterMetaState";
import { CharacterState } from "../../fight/character/CharacterState";
import { BuffState } from "../../fight/buff/BuffState";


@RegisterCharacter({ id: "1099" })
export class Character extends CharacterMetaState {

    name: string = "玉鼎真人"

    AnimationDir: string = "game/fight_entity/character/1099"


    AvatarPath: string = "game/texture/frames/hero/1099/spriteFrame"

    HeaderPath: string = "game/texture/frames/hero/Header/1099/spriteFrame"

    AnimationType: "DrangonBones" | "Spine" = "Spine"

    AnimationScale: number = 1

    HpGrowth: number = 45

    AttackGrowth: number = 30

    DefenceGrowth: number = 15

    PierceGrowth: number = 15

    SpeedGrowth: number = 17

    Energy: number = 90

    CharacterCamp: "ordinary" | "nature" | "abyss" | "dark" | "machine" | "sacred" = "sacred"

    position = 2

    CharacterQuality: number = 4

    PassiveIntroduceOne: string = `
    
    穿云剑法 Lv1
    普通攻击后，对场上敌方身后一个单位造成100点真实伤害
    `.replace(/ /ig, "")


    PassiveIntroduceTwo: string = `


    `.replace(/ /ig, "")

    SkillIntroduce: string = `
    
    太乙协同 Lv1
    与太乙在同一队伍时，增加自身200点生命上限，53点攻击，53点速度。
    `.replace(/ /ig, "")

    introduce: string = "是阐教元始天尊座下的“十二金仙”之一，排名第十，道场位于玉泉山金霞洞。"

    skillValue: string = `穿云剑法  太乙协同`


   
}