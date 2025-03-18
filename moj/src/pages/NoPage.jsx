
import GoBackButton from '../components/GoBackButton';

export default function NoPage(){
  return(
    <div className="mh-500">
      <GoBackButton />

      <h1>Page not found</h1>
      <h2 className="mt-4 mb-2 mediumText">This might be due to one of the following reasons:</h2>
      <ul>
        <li>The link you clicked is broken or outdated.</li>
        <li>The page has been moved or deleted.</li>
        <li>You may have mistyped the URL.</li>
      </ul>
    </div>
  )
}