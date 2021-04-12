import "./details.css";
//NOTE lodash is a special case where, in order to tree shake, we must import it without using destructuring. For more details see https://developers.google.com/web/fundamentals/performance/optimizing-javascript/tree-shaking 
import debounce from "lodash-es/debounce";

async function getComponent() {
	const element = document.createElement("div");
	//NOTE below is an example of code-splitting
	const { default: _ } = await import(
		//NOTE below is an example of webpack smart comment, so we can name modules that are dynamically imported.
		/* webpackChunkName: "lodash" */ "lodash-es/array"
	);

	element.innerHTML = _.join(["Hello", "webpack"], " ");

	document.body.append(element);
}

document.body.onclick = getComponent;

//NOTE this turns on hot module reload for this JavaScript file. To enable HMR, every web page must have this function.

if (module.hot) {
	module.hot.accept();
}

//NOTE the code below sets up the service worker in production mode only. Only one file per website need to have this function.

if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker
			.register("/service-worker.js")
			.then((registration) => {
				console.log("SW registered: ", registration);
			})
			.catch((registrationError) => {
				console.log("SW registration failed: ", registrationError);
			});
	});
}
