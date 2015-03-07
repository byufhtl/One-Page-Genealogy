/**
 * Created by curtis on 3/7/15.
 */
/// <reference path="ISourceListener.ts"/>

interface ISource {
    start(id: string): void;
    setListener(listener: ISourceListener): void;
    pause(): void;
    play(): void;
}