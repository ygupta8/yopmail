const request = require('request-promise');
const cheerio = require('cheerio');

const YP = 'HZGH4BGLkZmZ0ZwL1AQt0BQH';
const YJ = 'AZwZlZmHjBGD5ZmLkZmDmZwp';
const SPAM = 'true';
const V = '2.8';

const contains = (a, b) => {
    return a.toLowerCase().indexOf(b.toLowerCase()) >= 0;
}

const inbox = (id, phrase, p = 1) => {
    return request.get(`http://m.yopmail.com/en/inbox.php?login=${id}&p=${p}&d=&ctrl=&scrl=&spam=${SPAM}&yf=115&yp=${YP}&yj=${YJ}&v=${V}&r_c=&id=`)
        .then((result) => {
            const $ = cheerio.load(result);
            const mails = [];
            let found = false;

            $('.lm_m').each((index, element) => {
                const el = $(element);
                const mail = ({
                    index,
                    when: el.find('.lmh').text(),
                    from: el.find('.lmf').text(),
                    subject: el.find('.lms_m').text(),
                    href: 'http://m.yopmail.com/en/' + el.attr('href'),
                    html: el.html()
                });

                if (phrase && !found) {
                    found = contains(mail.from, phrase) ||
                        contains(mail.subject, phrase);
                }

                mails.push(mail);
            });

            return {found, mails};
        });
}

module.exports = inbox;
