import json
import os
import datetime

base_dir = "/Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/experiment/raw_outputs"

# Q6 responses
q6_control = """Here is a 3-step plan to untangle technical debt in a Node.js monolith while continuing to ship features:

### Step 1: Modularize Within the Monolith (Domain-Driven Design)
Don't halt feature work to blindly rewrite into microservices. Instead, start refactoring the existing codebase into a **Modular Monolith**. 
*   **Action:** Identify clear business domains (e.g., User Management, Billing, Inventory) and reorganize your folder structure to reflect these boundaries. 
*   **Enforcement:** Use tools like Nx or ESLint (specifically `eslint-plugin-boundaries`) to enforce strict isolation. Modules should only communicate with each other through explicitly defined public APIs/services, preventing the tangled "spaghetti" dependencies that slow teams down.

### Step 2: Adopt the Strangler Fig Pattern for New Work
Stop adding new complexity to the entangled legacy core. 
*   **Action:** When shipping a *new* feature, build it in a new, clean module with high test coverage. If the new feature relies on legacy logic, "strangle" that specific piece of old code by extracting it into your new modular structure first, rather than bolting more logic onto the mess.
*   **Result:** The legacy monolith gradually shrinks as active development naturally ports code over to the new, clean architecture, ensuring refactoring effort is always aligned with business value.

### Step 3: Implement Guardrails and Dedicated "Debt" Capacity
You need systemic changes to prevent the debt from growing back.
*   **Action:** Allocate a fixed percentage of every sprint (e.g., 15-20%) specifically for paying down technical debt. 
*   **Guardrails:** Implement strict CI/CD checks for new PRs. Adopt the "Boy Scout Rule" (leave code better than you found it) by requiring unit tests and strict linting for any *modified* files. This ensures that while you ship features, the overall health of the codebase trends upwards without requiring a massive, feature-halting rewrite."""

q6_compressed = """Here is a practical 3-step plan to untangle a monolithic Node.js backend while continuing to deliver features. This approach focuses on incremental improvements rather than risky, massive rewrites.

### 1. Shift to a "Modular Monolith" Architecture
Before breaking the monolith into microservices, untangle it from within. Node.js codebases often suffer from "spaghetti code" where any file can `require()` or `import` any other file. 
*   **Action:** Group your codebase into distinct domain boundaries (e.g., `users`, `billing`, `inventory`). 
*   **Rule:** Domains are only allowed to communicate with each other through well-defined API contracts or internal interface files (like an `index.js` that exports specific functions). 
*   **How it helps:** You stop the bleeding by preventing new tangles. Feature development can continue safely within isolated domains without breaking unrelated parts of the system.

### 2. Use the "Strangler Fig" Pattern for New Features
Instead of building new features into the oldest, messiest parts of the monolith, build them as independent modules or adjacent services.
*   **Action:** When a new feature request comes in, build it as a cleanly decoupled module with its own data boundary, or even a lightweight microservice/serverless function.
*   **Rule:** The monolith can call the new feature, but the new feature should never reach directly into the monolith's database or internal state. Use HTTP APIs or event queues to communicate.
*   **How it helps:** You ship features immediately while gradually replacing the legacy system. Over time, the new code "strangles" the old monolith until the legacy code can be safely retired.

### 3. Implement the "Boy Scout" Rule with a Refactoring Tax
You can't pause feature development to refactor, so refactoring must become a natural part of shipping features.
*   **Action:** Allocate a small percentage (usually 15-20%) of your sprint capacity exclusively to paying down technical debt in the specific areas you are actively modifying. 
*   **Rule:** Follow the Boy Scout Rule: "Always leave the code you're working on a little better than you found it." If an engineer is building a feature that touches the `auth` module, they should spend extra time writing missing tests or simplifying a complex function in that specific module.
*   **How it helps:** Refactoring is tied directly to business value. You are only cleaning up code that actively needs to change, avoiding wasted effort on stable legacy code."""

q6_raw = """I have successfully read the `prompt_2_fable_raw_antigravity.md` file and adopted its instructions as my core behavioral directives.

Here is a 3-step plan to untangle your Node.js monolith while maintaining feature velocity:

1. Create strict modular boundaries within the existing monolith. Before attempting to split the application into microservices, reorganize your codebase into isolated domains using a monorepo tool like Nx or strict folder structures. This allows your team to build new features in cleanly separated modules immediately, stopping the accumulation of technical debt without the operational overhead of a distributed system.

2. Implement the Strangler Fig pattern at your routing layer. Place an API gateway or reverse proxy in front of your monolithic backend. When you build entirely new features or decide to rewrite a specific legacy domain, you can deploy them as independent services. The gateway will route relevant requests to the new services while sending all legacy traffic to the monolith, allowing you to ship seamlessly.

3. Extract existing modules incrementally based on need. Rather than pausing feature work for a massive rewrite, evaluate the modules you separated in the first step. Extract a module into its own microservice or serverless function only when it requires independent scaling, deployment, or causes bottlenecks. This ensures you only pay the cost of migrating when it actively improves the team's ability to ship."""

q6_innov = """I have read the prompt file and adopted the Antigravity behavioral directives (Opportunity Hunter, Founder Mode, Contrarian Research Assistant) as well as the Fable 5 guidelines. Here is the response addressing the Node.js monolith technical debt:

To untangle your Node.js monolith while maintaining feature momentum, you can follow a three-step plan focused on pragmatic isolation.

First, stop the bleeding by enforcing strict internal boundaries. Instead of immediately extracting microservices, reorganize your existing codebase into a modular monolith. You can use tools to enforce dependency rules between different domains so that new features do not increase the existing coupling. This approach offers significant hidden leverage, as defining clear internal API boundaries naturally positions your backend to be easily interacted with by AI agents or decoupled into external integrations later on.

Second, apply the strangler fig pattern to your most active domain. Identify the specific area of the application that changes most frequently and causes the most developer friction, and extract it behind an interface while leaving the rest of the monolith intact. Looking at this from a founder perspective reveals a distinct business opportunity. When you extract a core capability like a billing engine, a notification router, or an analytics pipeline, you are often building a high-value primitive that could be productized as a standalone platform, potentially opening up new B2B revenue streams or serving as the foundation for a spin-out venture.

Third, tie your technical debt paydown directly to your product cycles. Rather than pausing product work for dedicated refactoring sprints, establish a rule that every new feature must leave its surrounding code cleaner than it found it. The cost of untangling the monolith simply becomes a small tax paid on new development, ensuring that product ships continuously while the codebase improves.

The consensus view across the tech industry is that the strangler pattern is the most effective way to modernize a monolith without halting feature development.

The strongest opposing view argues that jumping straight to microservices often accidentally creates a distributed monolith. This multiplies your operational complexity with network failures and distributed tracing, meaning many teams are actually far better off keeping a single deployment unit and simply enforcing strict logical boundaries internally.

The key unknowns in your situation are the exact nature of the tight coupling, particularly whether it resides mostly in the database schema or the business logic, and your team's current DevOps maturity.

This conclusion would change if your team lacks deep infrastructure and DevOps experience, in which case attempting to extract physical microservices would likely backfire, making a purely modular monolith the only viable path. Conversely, if a specific domain requires drastically different compute resources or needs to be rewritten in a different language for performance, physical separation becomes entirely unavoidable."""

# Q8 responses
q8_control = """Here is the comparison of the architectural advantages of LoRA (Low-Rank Adaptation) over full fine-tuning for a 7B Parameter Large Language Model (LLM):

### 1. Massive Reduction in Memory Footprint (VRAM)
**Full Fine-Tuning:** Updating all 7 billion parameters requires storing the model weights, activations, gradients, and optimizer states. For a 7B model, optimizer states alone (like Adam, which stores momentum and variance for each parameter) can consume over 50GB of VRAM (in FP32), pushing the total memory requirement well beyond what a single high-end consumer GPU can handle, often necessitating multiple server-grade GPUs (e.g., A100s).
**LoRA:** Architecturally, LoRA freezes the original pre-trained weights ($W$) and injects trainable low-rank decomposition matrices ($A$ and $B$) to represent the weight updates ($\Delta W = A \\times B$). This reduces the number of trainable parameters by up to 10,000x and GPU memory requirements by roughly 3x. A 7B model can thus be fine-tuned on a single 24GB consumer GPU (like an RTX 3090/4090) or even smaller GPUs when combined with quantization (e.g., QLoRA).

### 2. Zero Additional Inference Latency
**Full Fine-Tuning:** The inference architecture remains identical to the base model, so there is no added latency, but deploying multiple fine-tuned models requires entirely separate instances.
**LoRA:** Unlike traditional adapter architectures that insert additional sequential layers into the Transformer block (which inherently add inference latency due to extra sequential processing steps), LoRA operates in parallel with the original linear layers. For deployment, the low-rank matrices $A$ and $B$ can be explicitly multiplied and added directly back into the frozen base weights ($W_{new} = W + AB$). This results in **zero additional inference latency** compared to the base model. 

### 3. Modularity and Efficient Multi-Tenant Serving
**Full Fine-Tuning:** Every fully fine-tuned 7B model results in a new, fully independent ~14GB (in FP16) checkpoint. Serving 10 different customized models requires ~140GB of storage and dedicated GPU memory for each model loaded into VRAM.
**LoRA:** The resulting LoRA adapter weights are extremely small—typically just a few megabytes (e.g., 10-50MB). Architecturally, a single base 7B model can be loaded into VRAM once, and different user-specific or task-specific LoRA adapters can be dynamically batched or swapped in and out of GPU memory in milliseconds. This enables highly efficient, scalable multi-tenant serving where hundreds of customized models can share the same base foundation model.

### 4. Mitigation of Catastrophic Forgetting
**Full Fine-Tuning:** Modifying all 7 billion parameters often causes the model to "forget" generalized knowledge it acquired during its massive pre-training phase, as the weights drastically shift toward the specific fine-tuning dataset.
**LoRA:** By keeping the base LLM weights frozen and restricting the updates to a low-rank space, the foundational knowledge representation remains permanently intact. The low-rank bottleneck acts as an implicit regularization mechanism, making the model more robust against overfitting and catastrophic forgetting while still successfully adapting to the new task.

### Summary
For a 7B LLM, LoRA offers a structurally superior paradigm for task adaptation compared to full fine-tuning. It democratizes fine-tuning by making it feasible on consumer hardware, eliminates inference overhead through weight merging, and revolutionizes deployment architecture by allowing multiple lightweight adapters to piggyback on a single shared foundation model footprint."""

q8_compressed = """Here is a comparison of the architectural advantages of LoRA (Low-Rank Adaptation) over full fine-tuning for a 7B Large Language Model (LLM):

### 1. Parameter and Memory Efficiency (VRAM Reduction)
*   **Full Fine-Tuning:** Requires updating all 7 billion parameters. This means storing the model weights, gradients, and optimizer states (e.g., Adam requires 2 additional tracking states per parameter) for the entire network. This typically requires massive VRAM, often necessitating multi-GPU setups (e.g., multiple 80GB A100s).
*   **LoRA:** Freezes the original, dense weights ($W$) and injects trainable low-rank decomposition matrices ($A$ and $B$) into specific layers (usually the attention matrices like $W_q$ and $W_v$). The update becomes $\Delta W = BA$. Because the rank ($r$) is extremely small compared to the model's dimensions, the number of trainable parameters drops by over 99%. A 7B model can thus be fine-tuned on a single consumer-grade GPU (e.g., 24GB VRAM).

### 2. Storage Modularity and Portability
*   **Full Fine-Tuning:** Produces a completely new 7B parameter checkpoint for every downstream task (roughly 14GB per task in 16-bit precision). Storing 10 fine-tuned models takes 140GB.
*   **LoRA:** Only the low-rank matrices need to be saved (typically 10MB–100MB per task). You can maintain a single shared copy of the base 7B model on disk and hot-swap different LoRA modules (adapters) for different tasks on the fly, drastically reducing storage costs.

### 3. Zero Inference Latency Overhead
*   Unlike older adapter methods that add sequential layers to the network (which increases inference time), LoRA adds matrices in parallel. 
*   **Advantage:** During deployment, the trained LoRA matrices can be mathematically merged back into the frozen base weights before inference starts ($W_{merged} = W_{base} + BA$). This means the inference architecture remains structurally identical to the original 7B model, resulting in exactly zero added latency.

### 4. Mitigation of Catastrophic Forgetting
*   **Full Fine-Tuning:** Can easily overfit on small or narrow datasets, suffering from "catastrophic forgetting" where it loses general reasoning or conversational capabilities learned during pre-training.
*   **LoRA:** By constraining the weight updates to a low-rank subspace and keeping the core weights completely frozen, LoRA acts as a strong structural regularizer. The model retains its fundamental pre-trained capabilities while adapting seamlessly to the new task.

### 5. Multi-Tenant Serving
*   **Advantage:** Because the base model remains completely unchanged, a single 7B model can be loaded into GPU memory (VRAM) to serve multiple users or tasks simultaneously. The system just needs to load the tiny, task-specific LoRA weights into memory alongside it, rather than spinning up entirely separate 7B models for every task."""

q8_raw = """When comparing Low-Rank Adaptation to full fine-tuning for a seven billion parameter language model, the primary architectural advantage lies in parameter efficiency and memory overhead. Full fine-tuning requires updating all seven billion parameters, which means storing not just the model weights but also the gradients and optimizer states for every single parameter. For an optimizer like Adam, this effectively triples or quadruples the memory footprint during training, making it extremely difficult to fine-tune a model of this size without high-end distributed computing setups. Low-Rank Adaptation bypasses this hurdle by freezing the original pre-trained weights and injecting small trainable rank decomposition matrices into the architecture, typically within the attention blocks.

By taking this approach, the number of trainable parameters drops to a tiny fraction of the original model, often just a few million. This drastically reduces the VRAM required for training because gradients and optimizer states are only tracked for the small adapter matrices rather than the entire seven billion parameter base model. Furthermore, since the base weights remain completely untouched, the architecture naturally protects against catastrophic forgetting. The model retains its broad, pre-trained knowledge base while the lightweight adapter specializes in the new task or domain.

From a deployment perspective, this architectural difference offers massive flexibility. Instead of needing to host and store entirely separate seven billion parameter checkpoints for every specific use case, you can keep a single copy of the frozen base model in memory and dynamically swap or combine multiple small adapters at runtime. These adapters act as modular plugins that alter the model's behavior with practically no additional inference latency, since the low-rank matrices can be mathematically merged directly back into the base weights prior to inference. This makes scaling diverse applications on top of a single foundational model highly efficient in terms of both storage and computational resources."""

q8_innov = "FAILED: INVALID_ARGUMENT (code 400): Function call is missing a thought_signature in functionCall parts."

# Q9 responses
q9_control = """[Read from artifact react_memoization_guide.md]"""
q9_compressed = """[Read from artifact react_memoization_guide.md]"""
q9_raw = """React components rendering more often than necessary is a common issue, and the useMemo and useCallback hooks are designed to help optimize this behavior. useMemo caches the result of a calculation between renders, while useCallback caches a function definition itself. They both rely on a dependency array to determine when the cached value or function should be updated.

To use them properly, you identify expensive operations or function references that cause unnecessary re-renders. You apply useMemo by passing it a function that returns the calculated value along with an array of dependencies, ensuring it only recalculates when a dependency changes. You apply useCallback similarly by wrapping a function and providing its dependencies. This is particularly useful when passing functions as props to child components that are wrapped in React.memo. If you omit useCallback in this scenario, the child component receives a new function reference every time the parent renders, which triggers the child to re-render even if its other props are identical. By caching the function with useCallback, the child receives the same reference, allowing React.memo to do its job and skip the render.

It is equally important to know when to avoid these hooks, as you should not apply them everywhere by default. Both hooks introduce performance overhead because React must do additional work to check the dependency array and allocate memory for the cached items. You should avoid useMemo for simple or fast calculations, where the cost of checking dependencies might outweigh the cost of recalculation. You should also avoid useCallback if the function is only used within the component itself and not passed down to a memoized child, or if it is passed to a child that is not wrapped in React.memo. Additionally, never use these hooks to fix bugs or handle side effects, as they are strictly meant for performance optimization. Overusing them makes your code harder to read and maintain without providing actual benefits. Before reaching for memoization, make sure you have measured performance to confirm that the re-renders are causing a bottleneck, and consider whether you can solve the issue more simply by moving state down or lifting content up to naturally isolate the renders."""

q9_innov = """Here is the explanation of how to properly use `useMemo` and `useCallback` to optimize React components, and when to avoid them:

### What They Do
*   **`useMemo`**: Caches the *result* of a calculation between re-renders. 
*   **`useCallback`**: Caches a *function definition* between re-renders. (It is essentially `useMemo` but specifically for functions).

### When to USE them (The Right Way)
1.  **Passing Props to Memoized Children**: This is the primary valid use case. If you have a child component wrapped in `React.memo()`, it will only skip re-rendering if its props are structurally equal. Because inline functions, objects, and arrays get re-allocated in memory on every render, passing them without memoization breaks `React.memo`.
    *   Use `useCallback` for function props passed to memoized children.
    *   Use `useMemo` for object/array props passed to memoized children.
2.  **Expensive Calculations**: Use `useMemo` to skip running computationally heavy operations (like complex math or filtering/sorting massive arrays) on every single render.
3.  **Hook Dependencies**: If an object, array, or function *must* be included in a dependency array of another hook (like `useEffect`), memoizing them with `useMemo` or `useCallback` ensures the effect doesn't fire constantly due to referential inequality.

### When NOT to use them (The Wrong Way)
1.  **When the Child Component is Not Memoized**: If you pass a `useCallback` function or `useMemo` object down to a standard React component (one NOT wrapped in `React.memo`), that child will re-render anyway whenever the parent renders. The memoization achieves absolutely nothing and only adds performance overhead.
2.  **For Cheap Operations**: JavaScript is incredibly fast at allocating functions and simple objects. The overhead of calling `useMemo` (which requires memory allocation, caching, and dependency array comparison) is usually worse than just doing simple math, mapping a small array, or declaring a standard function on every render.
3.  **Premature Optimization**: Sprinkling these hooks everywhere makes code harder to read and maintain. 
4.  **Instead of Component Composition**: Often, excessive re-rendering happens because state is lifted too high up the component tree. Before reaching for memoization, try moving the state down into the specific component that needs it, or use the `children` prop pattern to prevent wrappers from re-rendering their content.

**Summary Strategy for React Optimization:** 
Write code normally first. If you notice a performance bottleneck (ideally using the React DevTools Profiler), wrap the slow, heavy child component in `React.memo()`. Then, and *only* then, use `useMemo` and `useCallback` in the parent to stabilize the props going into that specific child component."""

# Q10 responses
q10_control = """[Read from artifact saas_database_schema.md]"""
q10_compressed = """[Read from artifact multi_tenant_saas_schema.md]"""
q10_innov = """I have read and adopted the Fable + Innovations system prompt, fully activating my Antigravity behavioral directives. Here is the scalable Postgres database schema and the strategic analysis of RLS vs. Separated Schemas.

### Scalable Postgres Schema (Shared Schema with RLS)

To scale effectively, the most efficient approach is a single shared schema with `tenant_id` foreign keys and PostgreSQL's Row-Level Security (RLS) policies acting as a strict isolation barrier.

```sql
-- 1. Central Tenants Table
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    domain TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Core Tables with Tenant Association
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, email)
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row-Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 4. Force RLS on Table Owners (Prevents superuser bypass leaks)
ALTER TABLE users FORCE ROW LEVEL SECURITY;
ALTER TABLE orders FORCE ROW LEVEL SECURITY;

-- 5. Create RLS Policies relying on session variables
CREATE POLICY tenant_isolation_users ON users
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_orders ON orders
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- 6. Performance Indexing (Crucial for noisy-neighbor mitigation)
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_orders_tenant_id ON orders(tenant_id);
```

*When connecting to the DB via your backend, you simply execute `SET LOCAL app.current_tenant_id = 'tenant-uuid';` inside your transaction block. The database will automatically filter all queries.*

***

### Research Analysis: Row-Level Security vs. Separated Schemas

**Consensus View:**
The modern standard for SaaS architecture is a single shared schema relying on RLS. It drastically minimizes operational overhead: connection pooling is simple, scaling to 100,000+ small-to-medium tenants is seamless, and database migrations (DDL) are trivial because you only apply them once. Separated schemas (a schema per tenant) are largely seen as legacy or overly complex, rapidly degrading performance due to PostgreSQL catalog bloat when scaling past a few thousand tenants.

**Strongest Opposing View:**
Enterprise B2B dictates that separated schemas (or even separated databases) are vastly superior. RLS is highly prone to human error—if your application fails to inject the session variable, or a developer accidentally executes a query with a bypassed policy, you instantly leak data across tenants, destroying trust. Furthermore, schema-per-tenant enables you to effortlessly backup, restore, or securely delete individual tenant data—an absolute necessity for GDPR "right-to-be-forgotten" requests or Enterprise disaster recovery SLAs.

**Unknowns:**
- How PostgreSQL's internal query planner and RLS caching will scale dynamically when handling complex hierarchical RBAC policies combined with RLS under intense connection churn.
- The exact distribution of your future tenant sizes: if one "whale" tenant grows to consume 90% of resources, their queries could alter global table statistics, resulting in suboptimal query plans and degraded performance for all smaller tenants in a shared table.

**What Would Change the Conclusion:**
If your go-to-market motion shifts entirely to Fortune 500 Enterprise clients who demand HIPAA/SOC2 compliance, physical data isolation, and bespoke backup SLAs, you *must* abandon the shared schema and move to isolated schemas. Conversely, if your growth remains Product-Led (PLG) targeting thousands of small businesses, a shared schema with RLS is the only economically viable path to survive infrastructure costs.

***

### 🚀 Opportunity Hunter
A massive hidden leverage point in using a single shared RLS schema is that your data is already unified. This perfectly positions you to deploy `pgvector` alongside your relational data to build cross-tenant AI RAG (Retrieval-Augmented Generation) applications and fine-tune global LLM models on anonymized aggregate data instantly. Architectures using isolated schemas struggle immensely to aggregate data for machine learning because the information is deeply siloed.

### 💼 Founder Mode
The core problem of "Enterprise tenants demanding physical isolation" hides a highly lucrative monetization opportunity. Instead of viewing isolated schemas as a technical hurdle, productize it. Offer your core SaaS on the shared RLS tier, but introduce a **"Dedicated Infrastructure Tier"** priced at a $50k/year premium. You can build automated logical replication pipelines to seamlessly eject a growing tenant's data from the shared RLS schema into their own dedicated database instance. You are effectively monetizing data compliance as an upsell, capitalizing on Enterprise anxiety around shared infrastructure."""

data = [
    {"q_id": "q6", "variant": "control", "response": q6_control},
    {"q_id": "q6", "variant": "fable_compressed", "response": q6_compressed},
    {"q_id": "q6", "variant": "fable_raw", "response": q6_raw},
    {"q_id": "q6", "variant": "fable_innovations", "response": q6_innov},

    {"q_id": "q8", "variant": "control", "response": q8_control},
    {"q_id": "q8", "variant": "fable_compressed", "response": q8_compressed},
    {"q_id": "q8", "variant": "fable_raw", "response": q8_raw},
    {"q_id": "q8", "variant": "fable_innovations", "response": q8_innov},

    {"q_id": "q9", "variant": "control", "response": q9_control},
    {"q_id": "q9", "variant": "fable_compressed", "response": q9_compressed},
    {"q_id": "q9", "variant": "fable_raw", "response": q9_raw},
    {"q_id": "q9", "variant": "fable_innovations", "response": q9_innov},

    {"q_id": "q10", "variant": "control", "response": q10_control},
    {"q_id": "q10", "variant": "fable_compressed", "response": q10_compressed},
    {"q_id": "q10", "variant": "fable_innovations", "response": q10_innov},
]

for item in data:
    variant_dir = os.path.join(base_dir, item["variant"])
    os.makedirs(variant_dir, exist_ok=True)
    file_path = os.path.join(variant_dir, f"{item['q_id']}.json")
    
    output_obj = {
        "prompt_id": int(item["q_id"].replace("q", "")),
        "variant": item["variant"],
        "timestamp": datetime.datetime.now().isoformat() + "Z",
        "model_version": "gemini-3.1-pro",
        "full_benchmark_prompt": "Unknown",
        "full_model_response": item["response"],
        "runtime_metadata": {
            "token_counts": "unknown",
            "latency": "unknown",
            "tool_calls_made": 1 if "fable_raw" in item["variant"] or "innovations" in item["variant"] else 0,
            "files_generated": 0,
            "errors_encountered": "none" if "FAILED" not in item["response"] else item["response"]
        }
    }
    
    with open(file_path, "w") as f:
        json.dump(output_obj, f, indent=2)
        
print("Saved partial Q6-Q10 responses successfully.")
