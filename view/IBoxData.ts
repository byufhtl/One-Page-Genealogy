///<reference path="IBoxRender.ts"/>
/**
 * Created by justinrasband on 11/17/15.
 */
abstract
class IBoxData implements IBoxRender{

    abstract
    render(box:IBox, rootElement): any;
    abstract
    move(box:IBox, graphic: any, rootElement): any;

    abstract
    getType(): string;
    abstract
    getHeight(): number;
    abstract
    getWidth(): number;
    abstract
    requiresLoad(): boolean;

    getFont():string{
        return "font-family: 'Roboto Slab' " ;
    }
}