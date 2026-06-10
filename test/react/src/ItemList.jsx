// NOTE: This file intentionally uses the ".jsx" extension to prove that "eslint ." discovers ".jsx" files (via the
//       "files" entry in the "eslint-config-ironplate/react.js" config)

import { useEffect, useState } from 'react';

const items = ['one', 'two', 'three'];

const ItemList = function () {
    const [title, setTitle] = useState('Items');

    useEffect(() => {
        document.title = title;
    }, [title]);

    if (items.length > 100) {
        // eslint-disable-next-line react-hooks/rules-of-hooks, @eslint-react/use-state
        useState('proves "eslint-plugin-react-hooks" rules are active');
    }

    return (
        <div>
            <button type="button" onClick={() => setTitle('Items (updated)')}>Update title</button>
            <ul>
                {items.map((item) => (
                    // eslint-disable-next-line @eslint-react/no-missing-key
                    <li>{item}</li>
                ))}
            </ul>
        </div>
    );
};

export { ItemList };
