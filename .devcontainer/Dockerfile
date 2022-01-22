ARG VARIANT="3"
FROM mcr.microsoft.com/vscode/devcontainers/python:0-${VARIANT}

ARG COPILOT_VERSION="v1.13.0"
RUN /usr/local/bin/python -m pip install --upgrade pip

# install devtools
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - && \
    apt update && \
    apt install -y git openssh-client less vim jq

# install docker client
RUN  apt install -y apt-transport-https \
    ca-certificates \
    curl \
    gnupg2 \
    software-properties-common && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add - && \
    add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable" && \
    apt update && \
    apt install -y docker-ce-cli

# install the nodejs 14.x & npm
RUN curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh && \
    bash nodesource_setup.sh && \
    apt update && \
    apt install -y build-essential nodejs

# install the latest AWS CDK
RUN npm install -g aws-cdk \
    && pip3 install --upgrade aws-cdk.core

# install the latest AWSCLIv2
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install && \
    apt install -y groff-base

# install the latest AWSSAMCLI
RUN pip3 install aws-sam-cli --upgrade

# install the latest AmplifyCLI
RUN npm install -g @aws-amplify/cli

# install the latest aws-sso-util
RUN pip3 install aws-sso-util --upgrade

# install the latest ECS CLI
RUN curl -Lo /usr/local/bin/ecs-cli https://amazon-ecs-cli.s3.amazonaws.com/ecs-cli-linux-amd64-latest && \
    chmod 755 /usr/local/bin/ecs-cli

# install the latest Copilot CLI
RUN curl -Lo /usr/local/bin/copilot https://github.com/aws/copilot-cli/releases/download/${COPILOT_VERSION}/copilot-linux-${COPILOT_VERSION} && \
    chmod 755 /usr/local/bin/copilot

# install the latest EBCLI
RUN pip3 install awsebcli --upgrade

# clean up
RUN apt remove -y software-properties-common gnupg2 apt-transport-https build-essential && \
    apt autoremove -y && \
    apt clean
