+++
title = 'The technical Details - Just for you Nerds'
date = 2024-01-18T14:15:12-08:00
# draft = false

+++

Part of the reason I built arts-link.com is I know artists want to maintain control over their work. They may not know how to express this, but privacy and control over their own content is a top concern for many artists. We created features of this platform that fit that mold.

## Using open source tools, even for our customers
- github.com actions to modify your galleries

## Source Code

The source code for your website is yours, you should have access to it and be in control of it. The software that builds your site — the site generator, the theme, the styling, the editing interface — is [open source](https://opensource.com/resources/what-open-source), freely available for anyone to analyze or use. That openness is part of what makes it trustworthy: code anyone can read is code that gets scrutinized for security issues.

A few commercial services sit around that foundation, because for some jobs a hosted product beats running your own. Hosting, contact form handling, and privacy-conscious analytics are the usual ones, and they run on the arts-link account so you do not have to sign up for or manage them. None of them own your website. The form is a URL that can point elsewhere, the analytics is a script that can be removed, and your site is static files that can be deployed anywhere. What matters — the content, the templates, and the full history of changes — stays in a repository you can take with you.

The specific files that create your website can be hosted in your own git repository. We use [github.com](https://www.github.com/) to host our artist websites, but you may use any git source you choose, including a self hosted repository only you have access to. If you want to have complete control over the website, but have arts-link manage it for you you can create a repository in your own github account, and just add arts-link the access needed to provide updates. Or, you can just have us manage all of that for you, knowing that if you do decide to leave, you can take it with you.

## Hosting  

The technology arts-link uses to create your website is what is referred to as SSG - static site generator - website builder. What this means is that all of the things that usually happen online, like connections with databases and external services do not happen on.  Your website is a single directory which you can literally host anywhere. It would run on a cloud host such as [AWS amplify](https://aws.amazon.com/amplify/), [netlify](), Google Cloud or Microsoft Azure. Now you may say, Hey! if your a privacy advocate why are you promoting these giant companies services? Well the answer is they are ubiqutous and work very well. We will also work with any other cloud provider you choose or your own self hosted server.