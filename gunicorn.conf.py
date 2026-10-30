"""
Gunicorn Production Server Configuration for AgriWaste to Worth
Optimized for multi-worker concurrency and TensorFlow/Groq AI inference latency
"""

import os
import multiprocessing

bind = f"0.0.0.0:{os.getenv('PORT', '5000')}"
workers = int(os.getenv('WEB_CONCURRENCY', '2'))
threads = 4
worker_class = 'gthread'
timeout = 180  # Allow up to 3 minutes for batch AI image inference / model loading
keepalive = 5
max_requests = 1000
max_requests_jitter = 50

# Logging
accesslog = '-'
errorlog = '-'
loglevel = 'info'
capture_output = True

