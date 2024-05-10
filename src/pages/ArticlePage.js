import { useParams } from "react-router-dom";
import articles from "./article-content";
import NotFoundPage from "./NotFoundPage";
import { useEffect, useState } from "react";
import CommentsList from "../components/CommentsList";
import axios from 'axios';
import useUser from "../hookks/useUser";
import AddCommentForm from "../components/AddCommentForm";

const ArticlePage = () => {
    const [articleInfo, setArticleInfo] = useState({ upvotes:0,comments: []})
    const { articleId} = useParams();
    // number conti.. update

    const { user, isLoading } = useUser();

    useEffect( () => {
           const loadArticleInfo = async () => {
            const response = await axios.get(`/api/articles/${articleId}`)
            const newArticleInfo = response.data;
            setArticleInfo(newArticleInfo);
        }
        loadArticleInfo();
    }, []);
    
     const article = articles.find(article => article.name === articleId);

     const addUpvote = async () => {
        const response = await axios.put(`/api/articles/${articleId}/upvote`);
        const updatedArticle = response.data;
        setArticleInfo(updatedArticle);
     }
    if (!article) {

        return <NotFoundPage />
    }

    return (
       <>
        <h1>{article.title}</h1>
        <div className="upvotes-section">
            {user
            ?<button onClick={addUpvote}>Upvote</button>
            :<button>Log in to upvote</button>}
        <p>This article has {articleInfo.upvotes} upvote(s)</p>
        </div>
        {article.content.map((paragraph,i) => (
            <p key={i}>{paragraph}</p>
        ))} 
        // user (?,:)login after articles page
        {user
         ? <AddCommentForm
         articleName={articleId}
         onArticleUpadated={updatedArticle => setArticleInfo(updatedArticle)} />
        : <button>Log in to add a comment </button>}
        <CommentsList comments={articleInfo.comments} />
       </>
    )
  }
  
  export default  ArticlePage;
  