const codeforcesScraper = require('./codeforcesScraper');
const leetcodeScraper = require('./leetcodeScraper');

const scrapers = [
    codeforcesScraper,
    leetcodeScraper
];

const fetchAllContests = async () => {
    let allContests = [];
    for (const scraper of scrapers) {
        try {
            const data = await scraper.fetch();
            allContests = allContests.concat(data);
        } catch (err) {
            console.error(`❌ Error executing scraper for ${scraper.platformName}:`, err.message);
        }
    }
    return allContests;
};

module.exports = {
    scrapers,
    fetchAllContests
};
