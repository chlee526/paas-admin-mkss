import sanitizeHtml from 'sanitize-html';

// RAM Validation
export const ValidationRam = (ram) => {
    if (!String(ram).trim().length) return '';

    ram = String(ram).toUpperCase();

    if (ram === 'Q' || ram === 'NA' || !String(ram).trim().length) return ram;

    // 음수일 때 양수로 변환
    ram = Math.abs(ram);

    // 숫자이면서 정수는 최대 3자리, 소수는 최대 2자리 테스트
    const lengthPattern = /^\d{1,3}(\.\d{1,2})?$/;
    if (!lengthPattern.test(ram)) {
        ram = '';
        return ram;
    }

    // 숫자이면서 정수일 때 소숫점 추가
    if (!/^[-+]?\d+\.\d+$/.test(ram)) ram = ram.toFixed(1);

    return ram.trim();
};

// MktName Validation
export const ValidationMkt = (mkt) => {
    if (!String(mkt).trim().length) return '';
    mkt = mkt.trim().replace(/['"]/g, '');

    return mkt;
};

// Dual Sim Validation
export const ValidationSim = (sim, list) => {
    if (!sim.trim().length) return sim.trim();
    sim = sim.toUpperCase();
    if (!list.includes(sim.trim())) sim = '';
    return sim.trim();
};

// Parse SiteURL
export const parseSiteUrl = (url) => {
    if (!url.trim().length) return '';

    const matchSentense = url.match(/#(.*)$/) || [];
    let result = url;
    if (matchSentense.length) {
        const word = matchSentense[0];
        result = result.replace(word, `<strong style="color:#d54141;">${word}</strong>`);
    }
    return result;
};
