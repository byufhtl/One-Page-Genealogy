///<reference path="IBoxRender.ts"/>
///<reference path="boxStyles/BasicSVGBox.ts"/>
///<reference path="boxStyles/ClickRenderBox.ts"/>
///<reference path="boxStyles/SimpleNameBox.ts"/>
///<reference path="boxStyles/CompactSimpleNameBox.ts"/>
///<reference path="boxStyles/HorizontalNameLifeBox.ts"/>
///<reference path="boxStyles/LargePictureBox.ts"/>
///<reference path="boxStyles/LargePictureBox2.ts"/>
///<reference path="boxStyles/LargePictureDetailBox2.ts"/>
///<reference path="boxStyles/MidLargePictureBox.ts"/>
///<reference path="boxStyles/MediumPictureBox.ts"/>
///<reference path="boxStyles/MediumPictureDetailBox.ts"/>
///<reference path="boxStyles/MedSmPictureDetailBox.ts"/>
///<reference path="boxStyles/SmallPictureBox.ts"/>
///<reference path="boxStyles/SmallPictureBox2.ts"/>
///<reference path="boxStyles/SmallPictureDetailBox.ts"/>
///<reference path="boxStyles/SmallPictureDetailBox2.ts"/>
///<reference path="boxStyles/SmallNameBox.ts"/>
///<reference path="boxStyles/SmallDetailBox.ts"/>
///<reference path="boxStyles/XSNameBox.ts"/>
///<reference path="boxStyles/XSNameYearBox.ts"/>
///<reference path="boxStyles/XSDetailBox.ts"/>
///<reference path="boxStyles/SmallestNameBox.ts"/>
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
        boxTypes.push(new LargePictureDetailBox2());
        boxTypes.push(new MidLargePictureBox());
        boxTypes.push(new MediumPictureBox());
        boxTypes.push(new MediumPictureDetailBox());
        boxTypes.push(new MedSmPictureDetailBox());
        boxTypes.push(new SmallPictureBox());
        boxTypes.push(new SmallPictureBox2());
        boxTypes.push(new SmallPictureDetailBox());
        boxTypes.push(new SmallPictureDetailBox2());
        boxTypes.push(new SmallNameBox());
        boxTypes.push(new SmallDetailBox());
        boxTypes.push(new XSNameBox());
        boxTypes.push(new XSNameYearBox());
        boxTypes.push(new XSDetailBox());
        boxTypes.push(new SmallestNameBox());

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
    static requiresLoad(type: string): boolean {
        BoxStyleFactory.init();
        return BoxStyleFactory.boxes[type].requiresLoad();
    }

}