///<reference path="IBoxRender.ts"/>
///<reference path="boxStyles/BasicSVGBox.ts"/>
///<reference path="boxStyles/ClickRenderBox.ts"/>
///<reference path="boxStyles/SimpleNameBox.ts"/>
///<reference path="boxStyles/CompactSimpleNameBox.ts"/>
///<reference path="boxStyles/HorizontalNameLifeBox.ts"/>
///<reference path="boxStyles/LargePictureBox.ts"/>
///<reference path="boxStyles/LargePictureBox2.ts"/>
///<reference path="boxStyles/MediumPictureBox.ts"/>
///<reference path="boxStyles/SmallPictureBox.ts"/>
///<reference path="boxStyles/SmallNameBox.ts"/>
///<reference path="boxStyles/XSNameBox.ts"/>
/**
 * Created by curtis on 3/13/15.
 */
class BoxStyleFactory {
    private static boxes: {[s: string]: IBoxRender};
    private static initialized = false;
    static init(): void {
        if(BoxStyleFactory.initialized) {
            return
        }

        var boxTypes:any[] = [];
        boxTypes.push(new BasicSVGBox());
        boxTypes.push(new ClickRenderBox());
        boxTypes.push(new SimpleNameBox());
        boxTypes.push(new CompactSimpleNameBox());
        boxTypes.push(new HorizontalNameLifeBox());
        boxTypes.push(new LargePictureBox());
        boxTypes.push(new LargePictureBox2());
        boxTypes.push(new MediumPictureBox());
        boxTypes.push(new SmallPictureBox());
        boxTypes.push(new SmallNameBox());
        boxTypes.push(new XSNameBox());

        BoxStyleFactory.boxes = {};

        for(var i=0; i<boxTypes.length; i++) {
            var type = boxTypes[i];
            BoxStyleFactory.boxes[type.getType()] = type;
        }

        BoxStyleFactory.initialized = true;
    }
    static getWidth(type: string): number {
        BoxStyleFactory.init();
        return BoxStyleFactory.boxes[type].getWidth();
    }
    static getHeight(type: string): number {
        BoxStyleFactory.init();
        return BoxStyleFactory.boxes[type].getHeight();
    }
    static getNewBoxStyle(type: string): IBoxRender {
        BoxStyleFactory.init();
        return BoxStyleFactory.boxes[type];
    }

}