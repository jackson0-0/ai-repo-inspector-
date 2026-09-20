# Submission

## What did you investigate first, and why?
My approach was starting to read the README, where I decided on the MCP option, so i checked the MCP tool first. Before reading the code I wanted to test the code first and analyze what errors it gave, I ran the test with a throwaway repo to see what would happen when I ran it. The issues that I ran into was that the path was always undefined and git always ran in the wrong folder. 

The reason for this was because the MCP tool calling repo_path but the code used repoPath. The AI agent kept getting undefined which made it more confusing than an error in the beginning because you wouldn't know that AI had access to the wrong repo, which is the most important part of our AI tool that analyzes repos. 

## What did you choose to implement or fix?
I chose to fix the first problems that I saw in order from reading the files and understanding which file giving an error would be the biggest issue. 

First was the MCP handler reading the wrong field, the schema calls for repo_path but the handler was reading input.repoPath, which wouldn't read our repo. I also removed the any type because that would remove type checking, which would be important becuase we want to catch errors if we are given the wrong type. Before testing I wanted to pull the handler out of server.tool() into our handleReview function because it kept starting the server when I was running test. 

Second I chose to fix was validation being able to run any shell commmand. The problem with the previous code is using "exec" instead of "execFile" because we don't really need access to shell syntax. 

Third I chose to fix the problem of when there is a failing check it crashing our report. IF a command ended with an error our code would reject the promise causing us to lose the whole report. I made it show a failed status instead, and also a 60 second timeout so when it is stuck it doens't cause our tool to do nothing and make it stay in an infinite loop.


## What did you intentionally not do?
I intentionally payed attention when touching the mcp-server.ts because that is where our post important part of our program depends on. 
When fixing the paths because our program coulnd't go into the right path, there was one thing I made sure of not to do : that is limiting it's path at all. This is important becuase when you are allowing AI to have access to your comptuer files for example it is important to be able to pass in a private folder and still get our report back. 


## Interface decision

- Decision: CLI-first / MCP-first / hybrid
MCP First 
- Primary user and execution environment:
The primary user is an AI coding agent running the server locally laucned by Claude or ChatGBT.

The indirect user would be the person that reads the report after the agent has changed the code. 

- Trust boundary and allowed capabilities:
I assumed that the input isn't trustworthy, the caller is an AI agent, and what if there was a repo telling it to do something harmful on host computer. I changed the exec to execFile and then only allowing 3 commands that being npm test, npm run typechcek and npm run build. This is important because I want to scope the access that it has, it is unreasonable for our AI to have full access when it only needs to read git history and write a report. 

- Reliability, discoverability, latency/context, and output tradeoffs:
reliability - is what is most important, I didn't want our tool to freeze so I fixed it showing failed with timeout rather than just showing an error 

discoverabillity - is fixed now that mcp has access to the right repository path 


output tradeoffs - is still in markdown, which if i still had more time i would change to json because from experinece you can break a problem down and details easier in json object 

- How supported interfaces remain consistent:
Both CLI and MCP tool can call reviewRepository, everything I fixed was MCP first but they use the same MCP adapter so CLI got the big fixes too
- Evidence that would change this decision:
I think I would change the descision of MCP first depending how majority of people are using it. If most calls come from command line or CLI instead of MCP clients, I would switch to CLI and work on it better for people to use, like implementing --help command and exit codes. 


## How did you use an AI coding agent?
I to reproduced each bug myself first, then I scoped the problem and use Claude in order to create test and running the tool against the test repos and trying to get as many errors as possible. Then trying to further understand the problem by asking questions. Then I scoped out each problem one by one, which is dependent on another and which needs to be fixed first. I would keep updating the code with claude summarizing context of each error from test and understanding it then finding the next fix. 

Claude is very helpful with suggestions on errors which I used to learn more in deph why each problem is happening. 

## Where did you check, correct, or reject an AI suggestion? (required)

The biggest thing that I had to correct from AI is pushing back on how much every change it tried to make. My problem with claude is that given a problem it always tries to do more than it is being asked about, the first version of validation fix when it added output truncation, structured object error, and others. I wanted to focus more on the problem at hand, changing the exec to execFIle, the allowlist and resolving instead of rejecting. I rather commit something where I understand the scope of the problem, the reason, and the solution for the fix. 

## Commands used to verify the result, with outcomes
I ran npx vitetest on each test file after every fix
I also re ran the original attack, with --validate "echo pwned > /tmp/pwned.txt" and confirmed it with ls that we wasn't creating another file, with validate false we still get the report but with false instead of crashing 


## A blocker you hit and how you approached it
One blocker that I hit was that I coulnd't test the MCP handler because how it was written. It was outside server.tool(), so I couldn't calll it directly. It also started server everytime it was imported which made testing it difficult. 

I approached it by pulling the handler out and making it it's own exported function and made it so the server only runs when the file is executed directly. This made the code testable.

## Known limitations and the next three things you would do
- make git errors return message of problem instead of crashing 
- fix git parsing 
- make it so we can change allowlist, so if we are running specific we can run different test like pytest and make test 


## Approximate focused-work time

- Start: 5:10
- Finish: 6:20
my last submit was earlier than timer because I thought filling out the submission.md was part of the time 