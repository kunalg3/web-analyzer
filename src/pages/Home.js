import React, { useState } from 'react';
import axios from 'axios';

function Home() {
  const API_KEY = process.env.REACT_APP_API_KEY;
  const [url, setUrl] = useState('');
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);

  const analyzePerformance = async () => {
    try {
      const response = await axios.get(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&key=${API_KEY}`);
      const data = response.data.lighthouseResult.audits;
      
      const metrics = {
        fcp: data['first-contentful-paint'].displayValue,
        lcp: data['largest-contentful-paint'].displayValue,
        tti: data['interactive'].displayValue,
        speedIndex: data['speed-index'].displayValue,
        totalSize: (data['total-byte-weight'].numericValue / 1024).toFixed(2),
        numRequests: data['network-requests'].details.items.length,
        serverConnectionTime: data['server-response-time'].displayValue,
      };
      setMetrics(metrics);
      setError(null);
    } catch (error) {
      setError('Error analyzing the URL. Please make sure the URL is correct and try again.');
      setMetrics(null);
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Website Performance Analyzer</h2>
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          value={url} 
          onChange={(e) => setUrl(e.target.value)} 
          placeholder="Enter website URL" 
          style={{ padding: '10px', width: '300px' }}
        />
        <button 
          onClick={analyzePerformance}
          style={{ padding: '10px 20px', marginLeft: '10px' }}
        >
          Analyze
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {metrics && (
        <div>
          <h3>Performance Metrics:</h3>
          <table border="1" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <tbody>
              <tr>
                <th style={{ padding: '10px' }}>Metric</th>
                <th style={{ padding: '10px' }}>Value</th>
              </tr>
              <tr>
                <td style={{ padding: '10px' }}>First Contentful Paint (FCP)</td>
                <td style={{ padding: '10px' }}>{metrics.fcp}</td>
              </tr>
              <tr>
                <td style={{ padding: '10px' }}>Largest Contentful Paint (LCP)</td>
                <td style={{ padding: '10px' }}>{metrics.lcp}</td>
              </tr>
              <tr>
                <td style={{ padding: '10px' }}>Time to Interactive (TTI)</td>
                <td style={{ padding: '10px' }}>{metrics.tti}</td>
              </tr>
              <tr>
                <td style={{ padding: '10px' }}>Speed Index</td>
                <td style={{ padding: '10px' }}>{metrics.speedIndex}</td>
              </tr>
              <tr>
                <td style={{ padding: '10px' }}>Total Request Size (KB)</td>
                <td style={{ padding: '10px' }}>{metrics.totalSize}</td>
              </tr>
              <tr>
                <td style={{ padding: '10px' }}>Number of Requests</td>
                <td style={{ padding: '10px' }}>{metrics.numRequests}</td>
              </tr>
              <tr>
                <td style={{ padding: '10px' }}>Server Connection Time</td>
                <td style={{ padding: '10px' }}>{metrics.serverConnectionTime}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Home;
