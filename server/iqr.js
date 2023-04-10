function calculateMedian(values) {
    const middleIndex = Math.floor(values.length / 2);
    if (values.length % 2 === 0) {
      // If there are an even number of values, take the average of the middle two values
      return (values[middleIndex - 1] + values[middleIndex]) / 2;
    } else {
      // If there are an odd number of values, take the middle value
      return values[middleIndex];
    }
  }
  
  function returnFiltered(stuff, deviationFactor) {
    const values = stuff;
    values.sort((a, b) => a - b);
    //Calculate median
    median = 0;
    const middleIndex = Math.floor(values.length / 2);
    console.log(values[middleIndex])
  
    //Calculate quartiles
    const q1 = calculateMedian(values.slice(0, middleIndex));
    const q3 = calculateMedian(values.slice(middleIndex + (values.length % 2 === 0 ? 0 : 1)));
    //apply filter
    
    const iqr = q3 - q1;
  
    const lowerBound = q1 - deviationFactor * iqr;
    const upperBound = q3 + deviationFactor * iqr;
    console.log(lowerBound)
    console.log(upperBound)

    const trimmedValues = values.filter((values) => values >= lowerBound && values <= upperBound);
    const outliers = values.filter((value) => value < lowerBound || value > upperBound);

    return outliers;

  }

  //lst = [146.997659574468,151.404285714285,154.152222222222,153.170772058823,153.949615384615,150.436024096385,155.5875,156.17,156.284,158.006026490066,147.957,154.891,158.466,158.611,157.351,160.762,92.73,150.401,158.57,160.503,161.351,157.234,157.628,156.453,155.138,151.562,161.986,153.608,157.528,148.887  ]
  //lst = [153.742,153.65,152.837,152.48,154.151,154.837,153.563,154.743,154.661,154.878,153.576,155.002,154.96,156.582,159.059,155.85,157.25,155.73,157.779,154.968,159.347,159.207,159.761,156.566,152.153,155.625,157.518,159.233,159.901,161.219,161.274,160.461  ]
  //lst = [154.144,151.335,87.143,154.766,156.713,155.094,158.127,156.116,148.725,149.327,156.521,159.182,160.24,161.057,161.059,160.508,161.545,157.651,164.93,163.017,164.807,158.534,162.803,159.908  ]
  //lst = [158.923,158.456,154.829,159.133,150.418,158.737,157.555,158.995,155.091,157.799,159.44,158.96,160.836,159.592,159.098,158.859,158.777,159.062,156.12,161.359,160.543,160.391,1371.223,1338.265,157.922,160.835,161.014,160.672,161.328,162.145,161.69,161.045,159.75,161.998,160.891,160.345,161.029,160.935,160.385,160.69,160.97]
  lst = [153.434,153.549,149.747,145.294,155.363,152.65,156.475,156.519,154.894,154.281,154.53,153.571,151.527,155.285,155.262,82.286,154.102,156.035,152.306,156.885,154.087,156.07,157.627,154.544,156.258,158.022,158.104,156.935,156.068,155.59,157.656,156.921,48.308,38.358,157.552,157.943,157.343,157.088,159.239,159.741,160.644,156.722,155.641,158.491,158.935,161.728,160.49,159.655,159.99,161.415,161.949,159.82,163.234,162.11,160.044,161.276,156.606,158.005,162.31,163.298,162.085,161.808,161.7,161.882,161.166,160.782,160.561,162.867]
  console.log(returnFiltered(lst, 2))

