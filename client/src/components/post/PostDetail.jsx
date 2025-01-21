import React from 'react';
import { useParams } from 'react-router-dom';   

const PostDetail = () => {
    const { domain, id } = useParams();
    return (
        <div>
            <h1>은실님이 넣어주시면 됩니다.</h1>
            <h1>{domain}</h1>
            <h1>{id}</h1>
        </div>
    );
};

export default PostDetail;