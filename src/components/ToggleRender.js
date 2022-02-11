import React  from 'react';
import TextBox from 'devextreme-react/text-box';

function FieldTagbox(data) {
    return (
        <TextBox
        id={data.id}
        readOnly={true}
        value={data.name}
        placeholder={data.name}
    />

    );
}

export default FieldTagbox;

