#!/usr/bin/env -S node

import type { Contract as End } from '../../snapshots/9d571113807c8a1225f0255017953d4adc0a68a31e5300134b8f4498d9a8048f/contract';
import endContract from '../../snapshots/9d571113807c8a1225f0255017953d4adc0a68a31e5300134b8f4498d9a8048f/contract.json' with { type: 'json' };

import type { Contract as Start } from '../../snapshots/f6180311f26205eac810d90f7fa6bbf2b7a2fb672b8afb8e18c52ebdc7bf0526/contract';
import startContract from '../../snapshots/f6180311f26205eac810d90f7fa6bbf2b7a2fb672b8afb8e18c52ebdc7bf0526/contract.json' with { type: 'json' };

import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

import type { SqlMigrationPlanOperation } from '@prisma/orm-postgres/family/control';
import type { PostgresPlanTargetDetails } from '@prisma/orm-postgres/target/planner-target-details';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations(): readonly (
    | SqlMigrationPlanOperation<PostgresPlanTargetDetails>
    | Promise<SqlMigrationPlanOperation<PostgresPlanTargetDetails>>
  )[] {
    return [
      this.createTable({
        schema: 'public',
        table: 'Receipt',
        columns: [
          col('createdById', 'int4', {
            notNull: true,
            codecRef: { codecId: 'pg/int4@1' },
          }),

          col('donationId', 'int4', {
            notNull: true,
            codecRef: { codecId: 'pg/int4@1' },
          }),

          col('id', 'SERIAL', {
            notNull: true,
            codecRef: { codecId: 'pg/int4@1' },
          }),

          col('issuedDate', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),

          col('receiptNumber', 'int4', {
            notNull: true,
            codecRef: { codecId: 'pg/int4@1' },
          }),

          col('replacedReceiptId', 'int4', {
            codecRef: { codecId: 'pg/int4@1' },
          }),

          col('status', 'text', {
            notNull: true,
            default: lit('ISSUED'),
            codecRef: { codecId: 'pg/text@1' },
          }),
        ],

        constraints: [
          primaryKey(['id']),

          checkExpression(
            'Receipt_status_check',
            "\"status\" IN ('ISSUED', 'VOID', 'REPLACED')",
          ),
        ],
      }),

      this.addUnique({
        schema: 'public',
        table: 'Receipt',
        constraint: 'Receipt_donationId_key',
        columns: ['donationId'],
      }),

      this.addUnique({
        schema: 'public',
        table: 'Receipt',
        constraint: 'Receipt_receiptNumber_key',
        columns: ['receiptNumber'],
      }),

      this.addForeignKey({
        schema: 'public',
        table: 'Receipt',
        foreignKey: {
          name: 'Receipt_donationId_fkey',
          columns: ['donationId'],
          references: {
            schema: 'public',
            table: 'Donation',
            columns: ['id'],
          },
          onDelete: 'restrict',
        },
      }),

      this.addForeignKey({
        schema: 'public',
        table: 'Receipt',
        foreignKey: {
          name: 'Receipt_createdById_fkey',
          columns: ['createdById'],
          references: {
            schema: 'public',
            table: 'User',
            columns: ['id'],
          },
          onDelete: 'restrict',
        },
      }),

      this.addForeignKey({
        schema: 'public',
        table: 'Receipt',
        foreignKey: {
          name: 'Receipt_replacedReceiptId_fkey',
          columns: ['replacedReceiptId'],
          references: {
            schema: 'public',
            table: 'Receipt',
            columns: ['id'],
          },
          onDelete: 'restrict',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);