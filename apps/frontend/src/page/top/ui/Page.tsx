import { Link } from 'react-router';

export const Page = () => (
  <div>
    <p style={{ marginBottom: '1rem' }}>
      <a href="https://lostrpg-751c1.firebaseapp.com/lost/" target="_blank">
        ルールブック
      </a>
    </p>

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
