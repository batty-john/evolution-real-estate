var nodemailer = require('nodemailer');
var pageActiveName = 'contact';

function sendEmail(emails, fromEmail, emailBody, cb) {
	// form submission

	var recEmailsString = emails.join(',');

	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'clovermessaging@gmail.com',
			pass: 'Tbolts215611!'
		}
	});

	var mailOptions = {
		from: fromEmail,
		to: recEmailsString,
		text: emailBody
	};

	transporter.sendMail(mailOptions, function (err, info) {
		console.log(err);
		console.log(info);
		if (cb) cb(err, info);
	})
}

module.exports = {
	index: function (req, res) {
		if (req.body && req.body.email) {
			// send email
			var emails = ['brian@cloversoftware.net'];
			var fromEmail = '"Evolution Real Estate - Messaging Service" <clovermessaging@gmail.com>';
			var emailBody = 'You received a new form submission from ' + req.body.name + '\r\n' +
				'\r\n' +
				'Name: ' + req.body.name + '\r\n' +
				'Email: ' + req.body.email + '\r\n' +
				'Subject: ' + req.body.subject + '\r\n' +
				'Message: ' + req.body.comments + '\r\n';
			sendEmail(emails, fromEmail, emailBody, function (err, info) {
				if(!err) {
					return res.view({
						pagetitle: 'Thank you! Contact',
						metaDescription: 'Contact us today at Evolution Real Estate in Vernal, UT',
						message: 'The message was sent successfully.',
						messageType: 'success',
						pageActiveName
					});
				} else {
					return res.view({
						pagetitle: 'Contact',
						metaDescription: 'Contact us today at Evolution Real Estate in Vernal, UT',
						message: 'There was a problem sending your message. Please try again.',
						messageType: 'error',
						pageActiveName
					});
				}

			});

		} else {
			return res.view({
				pagetitle: 'Contact Us',
				metaDescription: 'Contact us today at Evolution Real Estate in Vernal, UT',
				pageActiveName: pageActiveName,
				canonicalUrl: 'http://evolution.ninja/contact'
			});
		}
	},
	ajaxForm: function(req, res) {
		console.log(req.body);
		if (req.body && req.body.Email) {
			// send email
			var emails = ['brian@cloversoftware.net'];
			var fromEmail = '"Evolution Real Estate - Messaging Service" <clovermessaging@gmail.com>';
			var emailBody = [];

			for(var key in req.body) {
				if(req.body.hasOwnProperty(key)) {
					emailBody.push(`${key}: ${req.body[key]}`)
				}
			}

			emailBody = emailBody.join('\r\n');

			sendEmail(emails, fromEmail, emailBody, function (err, info) {
				if(!err) {
					return res.json(info);
				} else {
					return res.status(err.status).send(err);
				}
			});
		} else {
			return res.status(500).send({error: 'No information was sent in body.'});
		}
	}
};
