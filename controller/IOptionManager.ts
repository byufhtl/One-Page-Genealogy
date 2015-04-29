///<reference path="IOptionListener.ts"/>
/**
 * Created by curtis on 3/19/15.
 */
interface IOptionManager {
    handleOptionSetting(type:String, data: any) :void;
    setListener(listener: IOptionListener): void;
}