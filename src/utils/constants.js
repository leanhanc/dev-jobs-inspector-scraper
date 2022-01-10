const LAUNCH_OPTIONS = {
	args: ["--no-sandbox", "--disable-setuid-sandbox"],
	defaultViewport: { width: 1024, height: 780 },
	headless: process.env.NODE_ENV === "production" ? true : false,
	headles: true,
	ignoreHTTPSErrors: true,
	timeout: 50000,
};

const SEARCH_FOR = [
	".NET",
	"Android",
	"Angular",
	"AWS",
	"Backend",
	"Blockchain",
	"C/C++",
	"C#",
	"Cobol",
	"CSS",
	"Dev Ops",
	"DevOps",
	"Flutter",
	"Frontend",
	"Full Stack",
	"Golang",
	"iOS",
	"Java",
	"Javascript",
	"Laravel",
	"Microsoft .NET",
	"Mongo DB",
	"Node",
	"Php",
	"PL/SQL",
	"Postgres",
	"Python",
	"QA Automation",
	"React Native",
	"React",
	"Ruby",
	"Rust",
	"Selenium",
	"Solana",
	"SQL",
	"Svelte",
	"Vue JS",
];

const BUMERAN_URL = "https://www.bumeran.com.ar";
const COMPUTRABAJO_URL = "https://www.computrabajo.com.ar";
const ZONAJOBS_URL = "https://www.zonajobs.com.ar";

module.exports = {
	LAUNCH_OPTIONS,
	SEARCH_FOR,
	BUMERAN_URL,
	COMPUTRABAJO_URL,
	ZONAJOBS_URL,
};
