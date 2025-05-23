# n8n Pro Memory Node Guide

## Custom Memory Node Implementation

### Node Structure
```javascript
export class MemoryNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'God Max Pro Memory',
    name: 'godMaxProMemory',
    group: ['transform'],
    version: 1,
    description: 'Store and retrieve context',
    defaults: {
      name: 'Memory',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Store', value: 'store' },
          { name: 'Retrieve', value: 'retrieve' },
          { name: 'Search', value: 'search' }
        ],
        default: 'store',
      }
    ]
  };
}
```

## Memory Storage Patterns

### PostgreSQL Backend
```sql
CREATE TABLE workflow_memory (
  id SERIAL PRIMARY KEY,
  workflow_id VARCHAR(255),
  key VARCHAR(255),
  value JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_workflow_key ON workflow_memory(workflow_id, key);
```

### Redis Integration
```javascript
const redis = require('redis');
const client = redis.createClient();

// Store with TTL
await client.setex(`workflow:${id}:${key}`, 3600, JSON.stringify(data));

// Retrieve
const data = JSON.parse(await client.get(`workflow:${id}:${key}`));
```

## Pattern Matching

```javascript
function findSimilarPatterns(query, patterns) {
  return patterns
    .map(pattern => ({
      pattern,
      score: calculateSimilarity(query, pattern.text)
    }))
    .filter(match => match.score > 0.7)
    .sort((a, b) => b.score - a.score);
}
```

## Workflow Context

### Auto-Load Previous Context
```javascript
// First node in workflow
const previousRun = await getWorkflowContext($workflow.id);
if (previousRun) {
  $json.context = previousRun;
}
```

### Save Successful Results
```javascript
// Last node in workflow
if ($json.success) {
  await saveWorkflowContext($workflow.id, {
    result: $json,
    timestamp: new Date(),
    pattern: extractPattern($input)
  });
}
```

## Visual Context Integration

```javascript
// Store screenshot with context
const context = {
  screenshot: $binary.data,
  text: $json.description,
  workflow: $workflow.id,
  timestamp: new Date()
};

await storeVisualContext(context);
```

## Performance Tips

1. **Index frequently searched fields**
2. **Use connection pooling**
3. **Implement caching layer**
4. **Batch operations when possible**
5. **Clean old data periodically**