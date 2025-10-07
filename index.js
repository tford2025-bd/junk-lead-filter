const express = require('express');
const app = express();
app.use(express.json());

app.post('/webhooks/junk-lead-filter', (req, res) => {
  const { "Company Name": company, "Job Title": title, "Email Domain": domain, "Form Comments": comments } = req.body;

  const junkPatterns = {
    company: ['student', 'other', 'test', 'unknown', 'n/a', 'asdf', 'qwerty', 'demo', 'sample', 'none'],
    title: ['student', 'other', 'intern', 'test', 'n/a', 'asdf', 'demo', 'sample'],
    domain: ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'mail.ru', 'qq.com']
  };

  let junkReason = null;

  if (junkPatterns.company.some(p => company?.toLowerCase().includes(p)) ||
      junkPatterns.title.some(p => title?.toLowerCase().includes(p))) {
    junkReason = "Bad Company/Title";
  } else if (junkPatterns.domain.includes(domain?.toLowerCase())) {
    junkReason = "Employee";
  } else if (comments?.toLowerCase().includes("spam") || comments?.length < 5) {
    junkReason = "Customer Comments";
  }

  if (junkReason) {
    return res.json({
      lead_status: "Junk",
      persona: "Junk",
      junk_reason: junkReason
    });
  } else {
    return res.json({
      lead_status: "Valid"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Webhook running on port ${PORT}`));
