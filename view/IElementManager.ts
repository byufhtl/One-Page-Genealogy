///<reference path="../model/IBox.ts"/>
/**
 * Created by curtis on 3/25/15.
 */
interface IElementManager {
    requestElement(box: IBox): void;
    clearUnusedElement(): void;
    setBounds(x: number, y: number, w: number, h: number): void;
    setIgnoreBound(ignore: boolean): void;
}