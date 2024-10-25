+++
title = 'The technical Details - Just for you Nerds'
date = 2024-01-18T14:15:12-08:00
# draft = false

+++

Part of the reason I built arts-link.com is I know artists want to maintain control over their work. They may not know how to express this, but privacy and control over their own content is a top concern for many artists. We created features of this platform that fit that mold.

## Using open source tools, even for our customers
- github.com actions to modify your galleries

## Source Code

The source code for your website is yours, you should have access to it and be in control of it. We use [open source](https://opensource.com/resources/what-open-source) software to build everything we use on arts-link.com, which means that it is freely available for anyone to analyze or use. This freedom is what makes it the most secure software you can use, because it is open for anyone to look at it is heavily scrutinized for any security issues.

The specific files that create your website can be hosted in your own git repository. We use [github.com](https://www.github.com/) to host our artist websites, but you may use any git source you choose, including a self hosted repository only you have access to. If you want to have complete control over the website, but have arts-link manage it for you you can create a repository in your own github account, and just add arts-link the access needed to provide updates. Or, you can just have us manage all of that for you, knowing that if you do decide to leave, you can take it with you.

## Hosting  

The technology arts-link uses to create your website is what is referred to as SSG - static site generator - website builder. What this means is that all of the things that usually happen online, like connections with databases and external services do not happen on.  Your website is a single directory which you can literally host anywhere. It would run on a cloud host such as [AWS amplify](https://aws.amazon.com/amplify/), [netlify](), Google Cloud or Microsoft Azure. Now you may say, Hey! if your a privacy advocate why are you promoting these giant companies services? Well the answer is they are ubiqutous and work very well. We will also work with any other cloud provider you choose or your own self hosted server.