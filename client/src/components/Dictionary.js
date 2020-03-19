export default class Dictionary {
    constructor(name) {
        this.name = name;
        this.dict = {};
    }

    dictGenerator() {
        throw new Error(
            `dictGenerator is not implemented in the base class.
            Please override this method in your extended class.`
        );
    }
    canBeWord() {
        throw new Error(
            `canBeWord is not implemented in the base class.
            Please override this method in your extended class.`
        );
    }
    isWord() {
        throw new Error(
            `isWord is not implemented in the base class.
            Please override this method in your extended class.`
        );
    }
}