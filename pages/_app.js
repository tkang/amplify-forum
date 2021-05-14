import '../styles/globals.css'
import Amplify from "aws-amplify";
import config from "../src/aws-exports";
Amplify.configure(config);

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
