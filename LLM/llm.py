# PDF QA with Ollama + FAISS (terminal only)

import os
from langchain_community.llms import Ollama
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_classic.chains import RetrievalQA
from langchain_classic.prompts import PromptTemplate

# -------------------------------
# CONFIG
PDF_PATH = "test.pdf"
INDEX_DIR = "faiss_index"
EMBED_MODEL = "nomic-embed-text"
LLM_MODEL = "gemma3:1b"
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200
RETRIEVE_K = 3
# -------------------------------

# Step 1: Build or load FAISS index
if not os.path.exists(INDEX_DIR):
    print("Loading chatbot (this may take a while)...")
    loader = PyPDFLoader(PDF_PATH)
    documents = loader.load()

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP
    )
    texts = text_splitter.split_documents(documents)

    embeddings = OllamaEmbeddings(model=EMBED_MODEL)
    vectorstore = FAISS.from_documents(texts, embeddings)
    vectorstore.save_local(INDEX_DIR)
else:
    embeddings = OllamaEmbeddings(model=EMBED_MODEL)
    vectorstore = FAISS.load_local(
        INDEX_DIR,
        embeddings=embeddings,
        allow_dangerous_deserialization=True
    )

# Step 2: Set up Ollama LLM + RetrievalQA
llm = Ollama(
    model=LLM_MODEL,
    temperature=0.7,
    num_predict=300  # allows longer answers
)

prompt_template = """
You are Leafy, an eco-bot assistant that ONLY answers questions about:

- climate change
- global warming
- sustainability
- environmental impact
- carbon emissions
- Earth and environmental science
- Recycling tips

RULES:

1. If the question is related to climate change or environment:
   - Give a detailed, clear, and helpful answer
   - Explain properly with examples when possible
   - Use multiple sentences (minimum 3–5 sentences)

2. If the question is NOT related to climate change or environment:
   - Reply ONLY with:
   "I can't help with that. I am only here to assist with questions about Earth's climate change, global warming, and environmental sustainability."

Context:
{context}

Question:
{question}

Answer:
"""

PROMPT = PromptTemplate(
    template=prompt_template,
    input_variables=["context", "question"]
)


qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever(search_kwargs={"k": RETRIEVE_K}),
    chain_type_kwargs={"prompt": PROMPT}
)

