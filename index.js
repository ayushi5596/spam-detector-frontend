
        document.addEventListener('DOMContentLoaded', function() {
            const messageInput = document.getElementById('messageInput');
            const checkButton = document.getElementById('checkButton');
            const loadingIndicator = document.getElementById('loadingIndicator');
            const resultContainer = document.getElementById('resultContainer');
            const resultIcon = document.getElementById('resultIcon');
            const resultTitle = document.getElementById('resultTitle');
            const resultMessage = document.getElementById('resultMessage');
            const spamBar = document.getElementById('spamBar');
            const hamBar = document.getElementById('hamBar');
            const spamProbability = document.getElementById('spamProbability');
            const hamProbability = document.getElementById('hamProbability');
            
            checkButton.addEventListener('click', async function() {
                const message = messageInput.value.trim();
                
                if (!message) {
                    alert('Please enter a message to check.');
                    return;
                }
                
                // Show loading indicator
                loadingIndicator.style.display = 'block';
                resultContainer.style.display = 'none';
                
                try {
                    const response = await fetch('/predict', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ text: message }),
                    });
                    
                    if (!response.ok) {
                        throw new Error('Server error');
                    }
                    
                    const result = await response.json();
                    
                    // Update UI with result
                    const spamProb = (result.spam_probability * 100).toFixed(2);
                    const hamProb = (result.ham_probability * 100).toFixed(2);
                    
                    spamBar.style.width = `${spamProb}%`;
                    hamBar.style.width = `${hamProb}%`;
                    spamProbability.textContent = `${spamProb}%`;
                    hamProbability.textContent = `${hamProb}%`;
                    
                    if (result.is_spam) {
                        resultIcon.textContent = '⚠️';
                        resultTitle.textContent = 'Spam Detected';
                        resultMessage.textContent = 'This message has been identified as spam.';
                        resultContainer.style.borderLeft = '5px solid #e74c3c';
                    } else {
                        resultIcon.textContent = '✅';
                        resultTitle.textContent = 'Not Spam';
                        resultMessage.textContent = 'This message appears to be legitimate.';
                        resultContainer.style.borderLeft = '5px solid #2ecc71';
                    }
                    
                    // Show result
                    resultContainer.style.display = 'block';
                } catch (error) {
                    console.error('Error:', error);
                    alert('An error occurred while checking the message. Please try again.');
                } finally {
                    // Hide loading indicator
                    loadingIndicator.style.display = 'none';
                }
            });
        });
    