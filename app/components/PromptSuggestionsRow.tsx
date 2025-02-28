import PromptSuggestionButton from "./PromptSuggestionButton";

const PromptSuggestionsRow = ({onPromptClick}) => {
    const prompts = [
        "What is the address of DIU?",
        "What are the departments of DIU?",
        "What is the contact number of DIU?",
        "What is the ranking of DIU?",
    ]
    return (
        <div className="prompt-suggestion-row">
            {prompts.map((prompt, index) => 
            <PromptSuggestionButton 
            key={`suggestion-${index}`}
            text={prompt} 
            onClick={ () => onPromptClick(prompt)} 
            />)}
        </div>
    )
}

export default PromptSuggestionsRow; 