function parseCodeforcesType(name) {
    if (/Div\. 1/i.test(name)) return 'Div1';
    if (/Div\. 2/i.test(name)) return 'Div2';
    if (/Div\. 3/i.test(name)) return 'Div3';
    if (/Div\. 4/i.test(name)) return 'Div4';
    if (/Educational/i.test(name)) return 'Div2';
    return 'Other';
}

const codeforcesScraper = {
    platformName: 'Codeforces',
    async fetch() {
        const response = await fetch('https://codeforces.com/api/contest.list');
        const json = await response.json();

        if (json.status !== 'OK') {
            throw new Error('Failed to fetch Codeforces contests');
        }

        const now = Math.floor(Date.now() / 1000);

        return json.result
            .filter(contest => contest.phase === 'BEFORE' && contest.startTimeSeconds > now)
            .map(contest => ({
                platformName: this.platformName,
                name: contest.name,
                startTime: contest.startTimeSeconds,
                duration: contest.durationSeconds,
                typeName: parseCodeforcesType(contest.name)
            }));
    }
};

module.exports = codeforcesScraper;
