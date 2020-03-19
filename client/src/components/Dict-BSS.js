import Dictionary from "./Dictionary.js";

const axios = require('axios');

export default class DictBSS extends Dictionary {
    constructor() {
        super("Binary Search String");
        this.minCharLimit = 4;
        this.maxCharLimit = this.minCharLimit;
    }

    _calcMaxCharLimit() {
        let max = 0;
        Object.values(this.dict).forEach(val => {
            Object.keys(val).forEach(key => {
                let int = parseInt(key);
                max = int > max ? int : max;
            });
        });
        this.maxCharLimit = max;
    }

    dictGenerator(callback) {
        var thisClass = this;
        console.time("Build Dict: Binary Search String ");
        console.log("dictGenerator()");
        axios.get('/dict')
            .then(function (response) {
                // console.log(response);
                thisClass.dict = response.data;
                thisClass._calcMaxCharLimit();
                // hideLoadingTab();
                console.timeEnd("Build Dict: Binary Search String ");
                callback();
            })
            .catch(function (error) {
                console.log("DICTIONARY DOWNLOAD FAILED");
                console.log(error);
            });
    }

    canBeWord(word) {
        var suffix = word.substring(1);
        var radix = suffix.length;
        var dictSlice = this.dict[word.substring(0, 1)];
        var keys = Object.keys(dictSlice);
        var dictStr;
        for (radix; radix <= keys[keys.length - 1]; radix++) {
            if (!dictSlice.hasOwnProperty(radix)) {
                continue;
            }
            dictStr = dictSlice[radix];
            var l = 0;
            var m;
            var h = dictStr.length / radix - 1;
            while (l <= h) {
                m = Math.floor((l + h) / 2);
                var str = dictStr.substr(m * radix, radix).substring(0, suffix.length);
                if (suffix > str) {
                    l = m + 1;
                }
                else if (suffix < str) {
                    h = m - 1;
                }
                else {
                    return word.substring(0, 1) + str;
                }
            }
        }
        return false;
    }

    isWord(word) {
        var suffix = word.substring(1);
        var radix = word.length - 1;
        var dictStr = this.dict[word.substr(0, 1)][radix];
        if (!dictStr) {
            return false;
        }
        var l = 0;
        var m;
        var h = dictStr.length / radix - 1;
        while (l <= h) {
            m = Math.floor((l + h) / 2);
            var str = dictStr.substr(m * radix, radix);
            if (suffix > str) {
                l = m + 1;
            }
            else if (suffix < str) {
                h = m - 1;
            }
            else {
                return word.substring(0, 1) + str;
            }
        }
        return false;
    }
}