function removeZScoreOutliers(data, threshold = 3) {
    const mean = data.reduce((acc, val) => acc + val, 0) / data.length;
    const stdDev = Math.sqrt(data.reduce((acc, val) => acc + (val - mean) ** 2, 0) / (data.length - 1));
    const zScores = data.map(val => (val - mean) / stdDev);
    return data.filter((val, index) => Math.abs(zScores[index]) <= threshold);
  }

lst = [146.997659574468,151.404285714285,154.152222222222,153.170772058823,153.949615384615,150.436024096385,155.5875,156.17,156.284,158.006026490066,147.957,154.891,158.466,158.611,157.351,160.762,92.73,150.401,158.57,160.503,161.351,157.234,157.628,156.453,155.138,151.562,161.986,153.608,157.528,148.887  ]
const threshold = 3;
const filteredData = removeZScoreOutliers(lst, threshold);
console.log(filteredData); // Output: [1, 2, 3, 4, 5]