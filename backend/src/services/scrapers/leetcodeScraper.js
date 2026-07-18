function getNextWeeklyContest(now) {
    const result = new Date(now);
    const day = result.getUTCDay();
    const hour = result.getUTCHours();
    const minute = result.getUTCMinutes();

    let daysUntilSunday = (7 - day) % 7;
    if (day === 0 && (hour < 2 || (hour === 2 && minute < 30))) {
        daysUntilSunday = 0;
    } else if (day === 0) {
        daysUntilSunday = 7;
    }

    result.setUTCDate(result.getUTCDate() + daysUntilSunday);
    result.setUTCHours(2, 30, 0, 0);
    return result;
}

function getNextBiweeklyContest(now) {
    const reference = new Date(Date.UTC(2022, 0, 8, 14, 30));
    const twoWeeksMs = 14 * 24 * 60 * 60 * 1000;
    let diff = now - reference;
    let periods = Math.floor(diff / twoWeeksMs);

    let candidate = new Date(reference.getTime() + periods * twoWeeksMs);
    if (candidate <= now) {
        candidate = new Date(candidate.getTime() + twoWeeksMs);
    }

    return candidate;
}

const leetcodeScraper = {
    platformName: 'LeetCode',
    async fetch() {
        const now = new Date();
        const w1 = getNextWeeklyContest(now);
        const w2 = new Date(w1.getTime() + 7 * 24 * 60 * 60 * 1000);

        const b1 = getNextBiweeklyContest(now);
        const b2 = new Date(b1.getTime() + 14 * 24 * 60 * 60 * 1000);

        const contests = [
            { platformName: this.platformName, name: 'LeetCode Weekly Contest', startTime: Math.floor(w1 / 1000), duration: 5400, typeName: 'Weekly' },
            { platformName: this.platformName, name: 'LeetCode Weekly Contest', startTime: Math.floor(w2 / 1000), duration: 5400, typeName: 'Weekly' },
            { platformName: this.platformName, name: 'LeetCode Biweekly Contest', startTime: Math.floor(b1 / 1000), duration: 5400, typeName: 'Biweekly' },
            { platformName: this.platformName, name: 'LeetCode Biweekly Contest', startTime: Math.floor(b2 / 1000), duration: 5400, typeName: 'Biweekly' }
        ];

        return contests
            .filter(c => c.startTime > Math.floor(now.getTime() / 1000))
            .sort((a, b) => a.startTime - b.startTime)
            .slice(0, 3);
    }
};

module.exports = leetcodeScraper;
