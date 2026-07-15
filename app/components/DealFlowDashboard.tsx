const handleSubscribe = async () => {
  try {
    const response = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user?.uid,
        userEmail: user?.email,
      }),
    });
    const data = await response.json();
    
    if (data.error) {
      alert(data.error);
      return;
    }
    
    window.location.href = data.url;
  } catch (error) {
    console.error('Error:', error);
    alert('Something went wrong. Please try again.');
  }
};