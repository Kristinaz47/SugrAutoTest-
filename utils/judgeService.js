/**
 * Created by Jeromeyang on 2018/2/1.
 * 回答判定服务
 */

const correctWord = [
    ['hong','kong', 'time'], ['france', 'capital'], ['remind'], ['second', 'sex', 'author'], ['let', 'spell'],
    ['tokyo', 'time'], ['wellington'], ['remind'], ['author', 'leo', 'tolstoy'], ['grandiose', 'spell'],
    ['st', 'paul', 'time'], ['south', 'korea', 'capital', 'seoul'], ['remind'], ['crime', 'punishment', 'author'], ['use', 'spell'],
    ['hartford', 'time'], ['el', 'salvador', 'capital'], ['remind'], ['alice', 'adventures', 'charles', 'written', 'by'], ['ink', 'spell'],
    ['time', 'SAN', 'luis', 'obispo', 'california'], ['canada', 'capital', 'ottawa'], ['remind'], ['twenty', 'thousand', 'leagues', 'under', 'author', 'jules'], ['IT', 'spell'],
    ['time', 'phoenix'], ['jamaica', 'capital', 'kingston'], ['remind'], ['author', 'leo', 'tolstoy'], ['put', 'spell']


];

exports.judge = function (item, text,next) {


    let keyWord = correctWord[item];
    let length = keyWord.length;
    let total = 0;
    keyWord.forEach(function (item, index) {
        if (text.indexOf(item) >= 0) {
            total++;
        }
    });

    next(total == length);
};


