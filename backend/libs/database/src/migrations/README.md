# Database Migrations

이 디렉토리는 TypeORM 데이터베이스 마이그레이션 파일들을 저장합니다.

## 📁 디렉토리 구조

```
libs/database/src/migrations/
├── README.md                    # 이 파일
├── 1672531200000-InitialSchema.ts    # 예시 마이그레이션
└── [timestamp]-[MigrationName].ts    # 마이그레이션 파일들
```

## 🚀 Migration 명령어

### 새로운 빈 Migration 생성
```bash
npm run migration:create libs/database/src/migrations/AddUserTable
```

### Entity 변경사항 기반 Migration 자동 생성
```bash
npm run migration:generate libs/database/src/migrations/UpdateUserEntity
```

### 대기 중인 Migration 실행
```bash
npm run migration:run
```

### 마지막 Migration 롤백
```bash
npm run migration:revert
```

### Migration 상태 확인
```bash
npm run migration:show
```

## 📝 Migration 파일 예시

```typescript
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddUserTable1672531200000 implements MigrationInterface {
    name = 'AddUserTable1672531200000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "user",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "255",
                        isUnique: true,
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "100",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("user");
    }
}
```

## ⚠️ 중요 주의사항

### 프로덕션 환경 Migration
1. **백업 필수**: 프로덕션 DB 백업 후 실행
2. **검증**: Staging 환경에서 먼저 테스트
3. **롤백 계획**: 실패 시 롤백 전략 수립

### Migration 작성 규칙
1. **항상 up/down 메서드 구현**
2. **원자성 보장**: 하나의 migration은 하나의 작업 단위
3. **데이터 손실 방지**: 컬럼 삭제 전 데이터 마이그레이션
4. **인덱스 관리**: 대용량 테이블의 인덱스는 CONCURRENTLY 옵션 사용

### 네이밍 컨벤션
- 파일명: `[timestamp]-[ActionName].ts`
- 클래스명: `[ActionName][timestamp]`
- 예시: `1672531200000-AddUserTable.ts` → `AddUserTable1672531200000`

## 🔧 트러블슈팅

### 일반적인 문제들

#### Migration 실행 실패
```bash
# 상태 확인
npm run migration:show

# 수동 롤백 (주의 필요)
npm run migration:revert
```

#### Entity와 스키마 불일치
```bash
# 새로운 migration 생성하여 동기화
npm run migration:generate libs/database/src/migrations/SyncSchema
```

#### Migration 테이블 문제
- 테이블명: `typeorm_migrations`
- 수동으로 레코드 조작 시 주의 필요

## 📚 참고 자료

- [TypeORM Migration 공식 문서](https://typeorm.io/migrations)
- [Migration API 참조](https://typeorm.io/migration-interface)
- [QueryRunner API](https://typeorm.io/query-runner)

---

**⚡ Quick Commands**:
- 생성: `npm run migration:create libs/database/src/migrations/[Name]`
- 자동생성: `npm run migration:generate libs/database/src/migrations/[Name]`
- 실행: `npm run migration:run`
- 롤백: `npm run migration:revert`
- 상태: `npm run migration:show`