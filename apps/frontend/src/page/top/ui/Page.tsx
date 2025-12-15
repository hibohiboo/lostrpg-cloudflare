import { Link } from 'react-router';

export const Page = () => (
  <div>
    <ul>
      <li>
        <Link to="/camp">camp</Link>
      </li>
      <li>
        <Link to="/camp/create">camp create</Link>
      </li>
    </ul>
  </div>
);
