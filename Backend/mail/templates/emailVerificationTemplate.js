const otpTemplate = (otp) => {
	return `<!DOCTYPE html>
	<html lang="en">
	
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>OTP Verification</title>
		<style>
			body {
				background-color: #f4f4f4;
				font-family: 'Arial', sans-serif;
				margin: 0;
				padding: 0;
				color: #333;
			}
	
			.container {
				max-width: 600px;
				margin: 40px auto;
				background: #ffffff;
				border-radius: 10px;
				box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
				overflow: hidden;
			}
	
			.header {
				background: linear-gradient(135deg, #ff7eb3, #ff758c);
				padding: 20px;
				text-align: center;
				color: #ffffff;
				font-size: 24px;
				font-weight: bold;
			}
	
			.content {
				padding: 30px;
				text-align: center;
			}
	
			.otp-code {
				font-size: 28px;
				font-weight: bold;
				color: #ff758c;
				margin: 20px 0;
			}
	
			.note {
				font-size: 14px;
				color: #666;
			}
	
			.cta-button {
				display: inline-block;
				margin-top: 20px;
				padding: 12px 24px;
				background: #ff758c;
				color: #ffffff;
				text-decoration: none;
				font-size: 16px;
				font-weight: bold;
				border-radius: 5px;
				transition: background 0.3s;
			}
	
			.cta-button:hover {
				background: #ff5c7a;
			}
	
			.footer {
				padding: 15px;
				font-size: 12px;
				color: #999;
				text-align: center;
				background: #fafafa;
				border-top: 1px solid #eee;
			}
		</style>
	</head>
	
	<body>
		<div class="container">
			<div class="header">StudyHive OTP Verification</div>
			<div class="content">
				<p>Hello,</p>
				<p>Your One-Time Password (OTP) for account verification is:</p>
				<div class="otp-code">${otp}</div>
				<p>This OTP is valid for <strong>5 minutes</strong>. Please do not share this code with anyone.</p>
				<a href="https://studynotion-edtech-project.vercel.app" class="cta-button">Verify Now</a>
				<p class="note">If you did not request this verification, you can safely ignore this email.</p>
			</div>
			<div class="footer">
				Need help? Contact us at <a href="mailto:info@studynotion.com">info@studynotion.com</a>
			</div>
		</div>
	</body>
	
	</html>`;
};

module.exports = otpTemplate;
