import emailjs from "@emailjs/browser";

emailjs.init("oZP7DMDQfB-wpahLJ");

window.addEventListener("DOMContentLoaded", () => {
	const form = document.getElementById("contactForm");
	const messageBox = document.getElementById("formMessage");
	const button = form.querySelector("button[type='submit']");

	form.addEventListener("submit", async (e) => {
		e.preventDefault();
		button.disabled = true;
		button.textContent = "Sending...";
		messageBox.textContent = "";
		messageBox.className = "mt-4 text-sm font-medium";

		try {
			await emailjs.sendForm("gracedis_contactform", "template_fr6n4s9", form);
			messageBox.textContent = "✅ Message sent successfully!";
			messageBox.classList.add("text-green-600");
			form.reset();
		} catch (error) {
			messageBox.textContent = "❌ Failed to send message. Please try again.";
			messageBox.classList.add("text-red-600");
			console.error(error);
		} finally {
			button.disabled = false;
			button.textContent = "Send Message";
		}
	});
});
