var Container = React.createClass({
    getInitialState : function() {
        return { language : this.props.language,
            category : this.props.category};
    },
    toggleLanguage : function () {
        switch(this.state.language){
            case "en":
                this.changeLanguage("se");
                break;
            case "se":
                this.changeLanguage("en");
                break;
            default:
                this.changeLanguage("en");
                break;
        }
    },
    changeLanguage : function(language){
        this.setState({category : this.state.category,language : language});
    },
    changeCategory : function(category) {
        this.setState({category : category,language : this.state.language});
    },
    render: function (){
        var img = "icons/"+this.state.language+".svg";
        window.location.hash = this.state.category+"-"+this.state.language;
        return <div>
        king i sinne
        <Footer/>
        </div>;
    }
});
var Footer = React.createClass({
    goContact: function (changeCategory) {
        changeCategory("contact");
    },
    render: function() {
        var lang = this.props.lang;
        return  (<footer>Utvecklad av <a target="_blank" hreflang="en" href="http://erik-andersson.se/">Erik Andersson</a> med hjälp av data tillhandahållen av <a target="_blank" hreflang="sv" href="http://www.shl.se/">SHL.se</a>.</footer>);
    }
});
ReactDOM.render(<Container/>,document.getElementById("root"));