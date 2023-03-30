import numpy as np
from scipy.stats import norm

import json
from datetime import datetime

def error_weighted_average(weights, times, error=0.02):
    """Calculate the error-weighted average of weights, given the corresponding times and measurement error."""
    
    # Convert datetime objects to seconds since the epoch
    times_sec = np.array([t.timestamp() for t in times])
    
    # Calculate the time differences between measurements in seconds
    delta_t = np.diff(times_sec)
    delta_t += 1e-8
    
    # Calculate the weights based on the time differences
    w_time = 1 / delta_t
    print(w_time)
    
    # Calculate the weights based on the normal distribution with mean=0 and std=error*w
    #w_error = norm.pdf(weights[:-1], loc=0, scale=error*weights[:-1])
    #print(w_error)
    # Combine the time weights and error weights
    w_combined = w_time
    
    # Normalize the weights
    w_normalized = w_combined / np.sum(w_combined)
    print(w_normalized)
    # Calculate the error-weighted average
    ewa = np.sum(w_normalized * weights[:-1])
    
    return ewa

# Sample JSON object with weight and time arrays
json_str = '{"weights": [10.5, 11.0, 10.8], "times": ["2023-03-29T09:00:00", "2023-03-29T09:05:00", "2023-03-29T09:15:00"]}'
json_obj = json.loads(json_str)

# Extract the weight and time arrays from the JSON object
weights = np.array(json_obj['weights'])
times = np.array([datetime.fromisoformat(t) for t in json_obj['times']])

# Calculate the error-weighted average of the weights
ewa = error_weighted_average(weights, times)

print("Error-weighted average: {:.2f} grams".format(ewa))