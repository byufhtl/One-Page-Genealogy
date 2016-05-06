///<reference path="BoxMap.ts"/>
/**
 * Created by jared on 3/17/16.
 */

abstract class AbstractStyler {

    private className: string;

    abstract applyStyle(boxes: BoxMap): void;

    public getName(): string{
        return this.className;
    }

    constructor(name:string){
        $("#opg-chart").css('fill','white');
        this.className = name;
    }
}