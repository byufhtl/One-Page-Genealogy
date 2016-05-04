/**
 * Created by calvinmcm on 5/4/16.
 */

class Instruction{
    private x :number;
    private y :number;
    private l :number;

    constructor(x :number, y :number, l :number = null){
        this.x = x;
        this.y = y;
        this.l = l;
    }

    setX(x :number) :Instruction{
        this.x = x;
        return this;
    }

    setY(y :number) :Instruction{
        this.y = y;
        return this;
    }

    setL(l :number) :Instruction{
        this.l = l;
        return this;
    }

    getX() :number{
        return this.x;
    }

    getY() :number{
        return this.y;
    }

    getL() :number{
        return this.l;
    }

    copy() :Instruction{
        return JSON.parse(JSON.stringify(this));
    }

}