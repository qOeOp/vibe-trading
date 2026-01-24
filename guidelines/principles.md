# Core Software Design Principles

Adhering to these principles is mandatory for all modules in Vibe Trading.

## 1. SOLID Principles

### S: Single Responsibility Principle (SRP)
A class or function should have one, and only one, reason to change.

**Bad:**
```python
class TradingService:
    def execute_trade(self, order):
        # 1. Logic to validate order
        # 2. Logic to calculate risk
        # 3. Logic to call exchange API
        # 4. Logic to log to database
        pass
```

**Good:**
```python
class OrderValidator:
    def validate(self, order): ...

class RiskManager:
    def check_margin(self, order): ...

class ExchangeClient:
    async def place_order(self, order): ...

class TradingEngine:
    # Orchestrates the above specialized services
    pass
```

### O: Open/Closed Principle (OCP)
Software entities should be open for extension, but closed for modification. Use inheritance or composition to add new behavior.

### L: Liskov Substitution Principle (LSP)
Objects of a superclass should be replaceable with objects of its subclasses without breaking the application.

### I: Interface Segregation Principle (ISP)
Clients should not be forced to depend on methods they do not use. Prefer many small, specific interfaces over one large, general one.

### D: Dependency Inversion Principle (DIP)
Depend on abstractions, not concretions. High-level modules should not depend on low-level modules.

---

## 2. DRY (Don't Repeat Yourself)
Every piece of knowledge must have a single, unambiguous, authoritative representation within a system.
- Use shared libraries (`libs/`) for common logic.
- Use base classes or utility functions for repeated patterns.

## 3. KISS (Keep It Simple, Stupid)
Avoid unnecessary complexity. Simple code is easier to test, maintain, and debug.
- Prefer readable code over "clever" one-liners.
- If a function is hard to explain, it's likely too complex.

## 4. YAGNI (You Ain't Gonna Need It)
Don't implement functionality until it's actually needed.
- Avoid "future-proofing" that adds complexity today for a hypothetical requirement tomorrow.

## 5. Composition over Inheritance
Prefer building complex objects by combining simpler ones rather than creating deep inheritance hierarchies. This makes code more flexible and easier to test.