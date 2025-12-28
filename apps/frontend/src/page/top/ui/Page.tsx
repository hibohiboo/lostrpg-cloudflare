import { Link } from 'react-router';

export const Page = () => (
  <div>
    <ul>
      <li>
        <Link to="/camp">キャンプ</Link>
      </li>
      <li>
        <Link to="/character">キャラクター</Link>
      </li>
    </ul>
  </div>
);
